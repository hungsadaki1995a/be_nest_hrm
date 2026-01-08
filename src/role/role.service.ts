import { AppException } from '@/app.exception';
import { getMessage } from '@/utils/message.util';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { ResponseModel } from '@/utils/response';
import { buildPagination } from '@/utils/search.util';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE_MESSAGE } from './constants/role.error.constant';
import { ROLE_SELECT_PROPERTIES } from './constants/role.select.constant';
import { ROLE_SORT_MAP, RoleSortField } from './constants/role.sort.constant';
import { RoleCreateDto, UpdateRoleDto } from './dtos/role.input.dto';
import { RoleSearchDto } from './dtos/role.search.dto';
import { buildRoleWhere } from './queries/role.search.query';
import { NO_CONTENT } from '@/constants/message.constant';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: RoleCreateDto) {
    const { code } = payload;
    const existed = await this.prisma.role.findUnique({ where: { code } });

    if (existed) {
      throw new AppException(
        getMessage(ROLE_MESSAGE.codeExisted),
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.prisma.role.create({
      data: payload,
      select: ROLE_SELECT_PROPERTIES,
    });

    return new ResponseModel(
      HttpStatus.CREATED,
      getMessage(ROLE_MESSAGE.createSuccess),
      role,
    );
  }

  async findAll(query: RoleSearchDto) {
    const { page, limit, sortBy, orderBy } = normalizePaginationAndSort(query, {
      sortBy: RoleSortField.CREATED_AT,
    });
    const prismaOrderBy = applySortOrder(ROLE_SORT_MAP[sortBy], orderBy);
    const where = buildRoleWhere(query);
    const { skip, take } = buildPagination(page, limit);

    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: prismaOrderBy,
        select: ROLE_SELECT_PROPERTIES,
      }),
      this.prisma.role.count({ where }),
    ]);

    const meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return new ResponseModel(HttpStatus.OK, NO_CONTENT, data, meta);
  }

  async findById(id: number) {
    if (!id) {
      throw new AppException(
        getMessage(ROLE_MESSAGE.isInteger, ['Id']),
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prisma.role.findUnique({
      where: { id },
      select: ROLE_SELECT_PROPERTIES,
    });
  }

  async delete(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new AppException(ROLE_MESSAGE.roleNotFound, HttpStatus.BAD_REQUEST);
    }

    // Check used by other user
    if (role._count.users) {
      throw new AppException(ROLE_MESSAGE.cannotDelete, HttpStatus.BAD_REQUEST);
    }

    await this.prisma.role.delete({
      where: { id },
    });

    return new ResponseModel(
      HttpStatus.NO_CONTENT,
      ROLE_MESSAGE.roleDeletedSuccess,
    );
  }

  async update(id: number, payload: UpdateRoleDto) {
    const role = await this.findById(id);

    if (!role) {
      throw new AppException(
        getMessage(ROLE_MESSAGE.roleNotFound),
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.prisma.role.update({
      where: { id },
      data: payload,
    });

    return new ResponseModel(
      HttpStatus.OK,
      ROLE_MESSAGE.updatedRoleSuccess,
      data,
    );
  }
}
