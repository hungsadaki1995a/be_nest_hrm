import { DEFAULT_USER_PASSWORD } from '@/constants/auth.constant';
import { hashPassword } from '@/utils/password.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.create({
    data: {
      code: 'ADMIN',
      name: 'Administrator',
      permissions: {
        create: {
          page: 'ROLE',
          canRead: true,
          canCreate: true,
          canUpdate: true,
          canDelete: true,
        },
      },
    },
  });

  const password = await hashPassword(DEFAULT_USER_PASSWORD);

  await prisma.user.create({
    data: {
      employeeId: '88888888',
      fullName: 'Nguyen Van A',
      email: 'test@gmail.com',
      phoneNumber: '0901234567',
      auth: {
        create: {
          password,
        },
      },
      roles: {
        create: { roleId: role.id },
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
