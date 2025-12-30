import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    const passwordHash = await bcrypt.hash('shinhan@1', 10);

    return this.prisma.user.create({
      data: {
        employeeId: '88888888',
        fullName: 'Pham Van Hao',
        address: 'The Mett, P. An Khanh, TP. HCM',
        email: 'admin@gmail.com',
        gender: 'male',
        phoneNumber: '088888888',
        auth: {
          create: {
            password: passwordHash,
            isActive: true,
            employeeId: '88888888',
          },
        },
      },
    });
  }

  async findByEmployeeId(employeeId: string) {
    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }
}
