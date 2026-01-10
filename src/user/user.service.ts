import { AppException } from '@/app.exception';
import { DEFAULT_USER_PASSWORD } from '@/constants/auth.constant';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { GenderCodeEnum, GenderEnum } from '@/types/auth.type';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from '@/auth/auth.service';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_SELECT_PROPERTIES } from './constants/user.select.constant';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { buildPagination } from '@/utils/search.util';
import {
  USER_SORT_MAP,
  UserSortFieldEnum,
} from './constants/user.sort.constant';
import {
  UserCreateDto,
  UserCreateProfileDto,
  UserUpdateDto,
} from './dtos/user.input.dto';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { buildUserWhere } from './queries/user.search.query';
import { UserSearchDto } from './dtos/user.search.dto';
import { handlePrismaError } from '@/prisma/prisma-error.handler';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private handleNotFoundError(field: string) {
    throw new AppException(
      getMessage(ERROR_MESSAGE.notFound, [field]),
      HttpStatus.NOT_FOUND,
    );
  }

  private validateEmployeeId(employeeId: string) {
    if (!employeeId) {
      this.handleNotFoundError('User');
    }
  }

  private mapRoleIdsToCreate(roleIds?: number[]) {
    if (!roleIds?.length) return undefined;

    return {
      create: roleIds.map((id) => ({
        role: { connect: { id } },
      })),
    };
  }

  async create(payload: UserCreateDto) {
    const currentYear = dayjs().format('YY');
    const currentMonth = dayjs().format('MM');
    const genderByCode =
      payload.gender == GenderEnum.MALE
        ? GenderCodeEnum.MALE
        : GenderCodeEnum.FEMALE;
    const randomThreeDegit = Math.floor(100 + Math.random() * 900);
    const employeeId = `${currentYear}${currentMonth}${genderByCode}${randomThreeDegit}`;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            employeeId: employeeId,
            fullName: payload.fullName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            roles: this.mapRoleIdsToCreate(payload.roleIds),
          },
        });

        await this.authService.create(user.id, DEFAULT_USER_PASSWORD, tx);
        await this.upsertProfile(user.id, { gender: payload.gender }, tx);

        return user;
      });
    } catch (e) {
      handlePrismaError(e, { module: 'User', entity: 'User' });
    }
  }

  async findAll(query: UserSearchDto) {
    const { page, limit, sortBy, orderBy } = normalizePaginationAndSort(query, {
      sortBy: UserSortFieldEnum.CREATED_AT,
    });
    const prismaOrderBy = applySortOrder(USER_SORT_MAP[sortBy], orderBy);
    const where = buildUserWhere(query);
    const { skip, take } = buildPagination(page, limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: prismaOrderBy,
        select: USER_SELECT_PROPERTIES,
      }),
      this.prisma.user.count({ where }),
    ]);

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

  async findByEmployeeId(employeeId: string) {
    this.validateEmployeeId(employeeId);

    const user = await this.prisma.user.findUnique({
      where: { employeeId },
      select: USER_SELECT_PROPERTIES,
    });

    if (!user) {
      this.handleNotFoundError('User');
    }

    return user;
  }

  async update(employeeId: string, payload: UserUpdateDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        return await tx.user.update({
          where: { employeeId },
          data: {
            employeeId: employeeId,
            fullName: payload.fullName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            roles: this.mapRoleIdsToCreate(payload.roleIds),
            profile: {
              update: {
                gender: payload.gender,
              },
            },
          },
        });
      });
    } catch (e) {
      handlePrismaError(e, { module: 'User', entity: 'User' });
    }
  }

  async upsertProfile(
    userId: number,
    data: UserCreateProfileDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;

    return prismaClient.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}
