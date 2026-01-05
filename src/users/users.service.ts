import { AppException } from '@/app.exception';
import { normalizePaginationAndSort } from '@/common/helpers';
import { buildPagination, icontains } from '@/common/prisma';
import { passwordDefault } from '@/consts/auth.const';
import { ErrorMessage } from '@/consts/message.const';
import { GenderByCode, GenderType } from '@/types/auth.type';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  userDetailSelectFields,
  userListSelectFields,
} from './consts/user-select-fields.dto';
import { UserCreateDto } from './dto/create-user.dto';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserSearchDto } from './dto/user-search.dto';

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
      return await this.prisma.user.create({
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
        throw new AppException(
          getMessage(ErrorMessage.duplicate, [fields.join(', ')]),
        );
      }
      throw new AppException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmployeeId(employeeId: string): Promise<UserDetailDto> {
    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
      select: userDetailSelectFields,
    });

    if (!employee) {
      throw new AppException('Employee not found', HttpStatus.NOT_FOUND);
    }

    const response: UserDetailDto = {
      basicInfo: {
        address: employee.address || '',
        dateOfBirth: employee.dateOfBirth || undefined,
        email: employee.email || '',
        fullName: employee.fullName || '',
        gender: employee.gender as GenderType,
        isActive: employee.isActive,
        phoneNumber: employee.phoneNumber || '',
        avatarUrl: employee.avatarUrl || '',
      },
      id: employee.id,
      employeeInfo: {
        onBoardAt: employee.onBoardAt as Date,
        roles: employee.roles?.map((value) => value.role) || [],
        employeeId: employee.employeeId,
      },
    };

    return response;
  }
  async findAll(searchCondition: UserSearchDto) {
    const {
      page,
      limit,
      sortBy,
      orderBy: sortOrder,
    } = normalizePaginationAndSort(searchCondition);

    const AND: Prisma.UserWhereInput[] = [];
    const query = searchCondition.query;

    if (searchCondition.query) {
      AND.push({
        OR: [{ employeeId: icontains(query) }, { fullName: icontains(query) }],
      });
    }

    const where: Prisma.UserWhereInput = AND.length ? { AND } : {};

    const { skip, take } = buildPagination(page, limit);
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: userListSelectFields,
      }),
      this.prisma.user.count({ where }),
    ]);

    const users = items.map((item) => ({
      ...item,
      roles: item.roles?.map((value) => value.role) || [],
    }));

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
