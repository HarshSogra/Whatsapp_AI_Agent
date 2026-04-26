const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findKumar() {
  try {
    const faculty = await prisma.faculty.findMany({ where: { name: { contains: 'Kumar', mode: 'insensitive' } } });
    const institute = await prisma.institute.findMany({ where: { OR: [ { name: { contains: 'Kumar', mode: 'insensitive' } }, { aiSystemPrompt: { contains: 'Kumar', mode: 'insensitive' } } ] } });
    const courses = await prisma.course.findMany({ where: { OR: [ { name: { contains: 'Kumar', mode: 'insensitive' } }, { description: { contains: 'Kumar', mode: 'insensitive' } } ] } });
    const students = await prisma.student.findMany({ where: { name: { contains: 'Kumar', mode: 'insensitive' } } });
    const messages = await prisma.message.findMany({ where: { content: { contains: 'Kumar', mode: 'insensitive' } }, take: 5 });

    console.log('--- FIND KUMAR RESULTS ---');
    console.log('Faculty:', faculty.length);
    console.log('Institute/Prompt:', institute.length);
    console.log('Courses:', courses.length);
    console.log('Students:', students.length);
    console.log('Messages (last 5):', messages.length);
    if (messages.length > 0) {
      messages.forEach(m => console.log(` - Msg: "${m.content.slice(0, 50)}..."`));
    }
    console.log('--------------------------');
  } catch (err) {
    console.error('Search Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

findKumar();
