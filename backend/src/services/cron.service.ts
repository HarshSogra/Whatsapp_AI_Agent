import cron from 'node-cron';
import { prisma } from '../index';
import { sendWhatsAppMessage } from './whatsapp.service';

/**
 * Multi-Tenant Schedulers: These run and check ALL students across ALL institutes.
 * Each message is sent using the specific institute's WhatsApp account ID and Token.
 */
export const initCronJobs = () => {
  // Daily fee reminder for booked students
  cron.schedule('0 10 * * *', async () => {
    console.log('Running daily fee reminder job...');
    try {
      const bookedStudents = await prisma.student.findMany({
        where: { status: 'BOOKED' },
        include: { institute: true }
      });

      for (const student of bookedStudents) {
        if (!student.phone || !student.institute.whatsappPhoneNumberId) continue;
        
        const message = `Hi ${student.name || 'Student'}, this is a gentle reminder regarding your pending admission process at ${student.institute.name}. Please contact the admin desk.`;
        
        await sendWhatsAppMessage({
          to: student.phone,
          message,
          token: student.institute.whatsappAccessToken || undefined,
          phoneId: student.institute.whatsappPhoneNumberId
        });
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });

  // Auto follow-up job runs every 20-30 minutes
  cron.schedule('*/20 * * * *', async () => {
    console.log('Running auto follow-up job...');
    try {
      const now = new Date();
      
      const eligibleStudents = await prisma.student.findMany({
        where: {
          followUpCount: { lt: 2 },
          lastHighIntentAt: { not: null },
        },
        include: {
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 1
          },
          institute: true
        }
      });

      for (const student of eligibleStudents) {
        if (!student.institute.whatsappPhoneNumberId) continue;

        const lastMsg = student.messages[0];
        if (!lastMsg || lastMsg.role !== 'user') continue;

        const timeSinceLastMsg = now.getTime() - lastMsg.timestamp.getTime();
        let followUpMessage = "";
        let followUpType: "FIRST" | "SECOND" | null = null;

        if (student.followUpCount === 0 && timeSinceLastMsg >= 2 * 60 * 60 * 1000) {
          const content = lastMsg.content.toLowerCase();
          const courseContext = content.includes('jee') ? 'JEE' : (content.includes('neet') ? 'NEET' : '');
          followUpMessage = courseContext 
            ? `Hi, just checking if you're interested in our ${courseContext} batch? 😊`
            : `Hi, just checking if you're interested in our upcoming batches at ${student.institute.name}? 😊`;
          followUpType = "FIRST";
        } 
        else if (student.followUpCount === 1 && timeSinceLastMsg >= 24 * 60 * 60 * 1000) {
          followUpMessage = "Seats are filling fast for upcoming batches! Let me know if you'd like to book a demo or reserve your spot 😊";
          followUpType = "SECOND";
        }

        if (followUpMessage && followUpType) {
          console.log(`Sending ${followUpType} follow-up to ${student.phone} via ${student.institute.name}`);
          
          await sendWhatsAppMessage({
            to: student.phone,
            message: followUpMessage,
            token: student.institute.whatsappAccessToken || undefined,
            phoneId: student.institute.whatsappPhoneNumberId
          });

          await prisma.student.update({
            where: { id: student.id },
            data: {
              followUpCount: { increment: 1 },
              lastFollowUpSentAt: new Date(),
              lastFollowUpType: followUpType
            }
          });
        }
      }
    } catch (error) {
      console.error('Follow-up Job Error:', error);
    }
  });
};
