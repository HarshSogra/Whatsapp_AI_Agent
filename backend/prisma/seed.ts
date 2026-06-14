import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const institute = await prisma.institute.upsert({
    where: { whatsappPhoneNumberId: 'demo' },
    update: {},
    create: {
      name: 'Demo Institute',
      whatsappPhoneNumberId: 'demo',
      whatsappAccessToken: 'demo',
    },
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      passwordHash,
      role: 'ADMIN',
      instituteId: institute.id,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
