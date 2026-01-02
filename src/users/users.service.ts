import { AppException } from '@/app.exception';
import { passwordDefault } from '@/consts/auth.const';
import { ErrorMessage } from '@/consts/message.const';
import { GenderByCode, GenderType } from '@/types/auth.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: UserCreateDto) {
    const currentYear = dayjs().format('YY');
    const currentMonth = dayjs().format('MM');
    const genderByCode =
      payload.gender == GenderType.MALE
        ? GenderByCode.MALE
        : GenderByCode.FEMALE;
    const randomThreeDegit = Math.floor(100 + Math.random() * 900);
    const employeeId = `${currentYear}${currentMonth}${genderByCode}${randomThreeDegit}`;
    console.log('employeeId', employeeId);
    const passwordHash = await bcrypt.hash(passwordDefault, 10);

    try {
      return this.prisma.user.create({
        data: {
          employeeId: employeeId,
          fullName: payload.fullName,
          address: payload.address,
          email: payload.email,
          gender: payload.gender,
          phoneNumber: payload.phoneNumber,
          onBoardAt: payload.onBoardAt,
          dateOfBirth: payload.dateOfBirth,
          roles: {
            create: payload.roleIds.map((roleId) => ({
              role: {
                connect: {
                  id: roleId,
                },
              },
            })),
          },
          auth: {
            create: {
              password: passwordHash,
              isActive: true,
              employeeId: employeeId,
            },
          },
          ...(payload.teamId && {
            team: {
              connect: { id: payload.teamId },
            },
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const fields = error.meta?.target as string[];
        throw new AppException(ErrorMessage.duplicate);
      }
    }
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
