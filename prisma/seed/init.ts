import { PrismaClient, Page } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('shinhan@1', 10);

  // Create ADMIN role
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      code: 'ADMIN',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      isActive: true,
    },
  });

  // Create full permissions for ADMIN role on all pages
  const allPages = Object.values(Page);
  
  for (const page of allPages) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_page: {
          roleId: adminRole.id,
          page: page,
        },
      },
      update: {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
      create: {
        roleId: adminRole.id,
        page: page,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
    });
  }

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { employeeId: '23053239' },
    update: {},
    create: {
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

  // Assign ADMIN role to user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('Seed completed successfully!');
  console.log(`Admin role created with ID: ${adminRole.id}`);
  console.log(`Admin user created with ID: ${adminUser.id}`);
  console.log('Full permissions granted for all pages:', allPages);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
