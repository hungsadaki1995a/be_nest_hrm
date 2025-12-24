import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('shinhan@1', 10);

  const employee = await prisma.user.create({
    data: {
      employeeId: '23053239',
      fullName: 'Pham Van Hao',
      address: 'The Mett, P. An Khanh, TP. HCM',
      email: 'test@gmail.com',
      gender: 'male',
      phoneNumber: '0123456789',
      auth: {
        create: {
          password: passwordHash,
          isActive: true,
          employeeId: '23053239',
        },
      },
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
