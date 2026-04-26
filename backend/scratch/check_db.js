const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const inst = await prisma.institute.count();
    const courses = await prisma.course.count();
    const students = await prisma.student.count();
    const messages = await prisma.message.count();
    const faculty = await prisma.faculty.count();
    
    console.log('--- DB SUMMARY ---');
    console.log('Institutes:', inst);
    console.log('Courses:', courses);
    console.log('Faculty:', faculty);
    console.log('Students (Leads):', students);
    console.log('Total Messages Logs:', messages);
    console.log('------------------');
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
