import cron from 'node-cron';
import { prisma } from '../index';
import { sendWhatsAppMessage } from './whatsapp.service';

// Scheduler logic
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
        if (!student.phone) continue;
        const message = `Hi ${student.name || 'Student'}, this is a gentle reminder regarding your pending admission process at ${student.institute.name}. Please contact the admin desk.`;
        await sendWhatsAppMessage(student.phone, message);
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
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Find students eligible for EITHER 1st or 2nd follow-up
      const eligibleStudents = await prisma.student.findMany({
        where: {
          followUpCount: { lt: 2 },
          lastHighIntentAt: { not: null },
          // We'll filter the specific timing inside the loop to handle both 2h and 24h
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
        const lastMsg = student.messages[0];
        
        // Safety: Only follow up if the last message was from the user
        if (!lastMsg || lastMsg.role !== 'user') continue;

        const timeSinceLastMsg = now.getTime() - lastMsg.timestamp.getTime();
        let followUpMessage = "";
        let followUpType: "FIRST" | "SECOND" | null = null;

        // Logic for FIRST follow-up (2 hours)
        if (student.followUpCount === 0 && timeSinceLastMsg >= 2 * 60 * 60 * 1000) {
          const content = lastMsg.content.toLowerCase();
          const courseContext = content.includes('jee') ? 'JEE' : (content.includes('neet') ? 'NEET' : '');
          
          followUpMessage = courseContext 
            ? `Hi, just checking if you're interested in our ${courseContext} batch? 😊`
            : `Hi, just checking if you're interested in our upcoming batches at ${student.institute.name}? 😊`;
          followUpType = "FIRST";
        } 
        // Logic for SECOND follow-up (24 hours)
        else if (student.followUpCount === 1 && timeSinceLastMsg >= 24 * 60 * 60 * 1000) {
          followUpMessage = "Seats are filling fast for upcoming batches! Let me know if you'd like to book a demo or reserve your spot 😊";
          followUpType = "SECOND";
        }

        if (followUpMessage && followUpType) {
          console.log(`Sending ${followUpType} follow-up to ${student.phone}`);
          await sendWhatsAppMessage(student.phone, followUpMessage);

          // Update tracking
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
