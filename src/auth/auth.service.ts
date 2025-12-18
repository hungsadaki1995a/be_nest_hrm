import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  create() {
    return this.prisma.auth.create({
      data: {
        employeeId: '23053239',
        passwordHash: 'passwordHash',
      },
    });
  }

  findByEmployeeId(employeeId: string) {
    return this.prisma.auth.findUnique({
      where: {
        employeeId,
      },
    });
  }
}
