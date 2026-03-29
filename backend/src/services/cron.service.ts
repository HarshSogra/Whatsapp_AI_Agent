import cron from 'node-cron';
import { prisma } from '../index';
import { sendWhatsAppMessage } from './whatsapp.service';

// Scheduler logic designed to run every day at 10:00 AM server time
export const initCronJobs = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('Running daily fee reminder job...');
    try {
      // Find students who have booked but not fully enrolled to send a gentle automated follow-up
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
};
