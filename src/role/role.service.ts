import { AppException } from '@/app.exception';
import { CacheService } from '@/cache/cache.service';
import { NO_CONTENT } from '@/constants/message.constant';
import { UpdateRolePermissionDto } from '@/dtos/role-permission-short.dto';
import { getMessage } from '@/utils/message.util';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { ResponseModel } from '@/utils/response';
import { buildPagination } from '@/utils/search.util';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE_MESSAGE } from './constants/role.error.constant';
import { ROLE_SELECT_PROPERTIES } from './constants/role.select.constant';
import {
  ROLE_SORT_MAP,
  RoleSortFieldEnum,
} from './constants/role.sort.constant';
import { RoleCreateDto, UpdateRoleDto } from './dtos/role.input.dto';
import { RoleSearchDto } from './dtos/role.search.dto';
import { buildRoleWhere } from './queries/role.search.query';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) { }

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
      sortBy: RoleSortFieldEnum.CREATED_AT,
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

    const role = await this.prisma.role.findUnique({
      where: { id },
      select: ROLE_SELECT_PROPERTIES,
    });

    if (!role) {
      throw new AppException(
        getMessage(ROLE_MESSAGE.roleNotFound),
        HttpStatus.NOT_FOUND,
      );
    }

    return role;
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
      throw new AppException(ROLE_MESSAGE.roleNotFound, HttpStatus.NOT_FOUND,);
    }

    if (role._count.users) {
      throw new AppException(ROLE_MESSAGE.cannotDelete, HttpStatus.BAD_REQUEST);
    }

    // Clear cache before delete
    await this.invalidateRoleCache(id);

    await this.prisma.role.delete({ where: { id } });

    return new ResponseModel(
      HttpStatus.OK,
      ROLE_MESSAGE.roleDeletedSuccess,
    );
  }

  async update(id: number, payload: UpdateRoleDto) {
    const role = await this.findById(id);

    if (payload.code && payload.code !== role.code) {
      const existingCode = await this.prisma.role.findFirst({
        where: {
          code: payload.code,
          id: { not: id }
        },
        select: { id: true },
      });

      if (existingCode) {
        throw new AppException(
          getMessage(ROLE_MESSAGE.codeExisted),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const data = await this.prisma.role.update({
      where: { id },
      data: payload,
      select: ROLE_SELECT_PROPERTIES,
    });

    // Clear cache after update
    await this.invalidateRoleCache(id);

    return new ResponseModel(
      HttpStatus.OK,
      ROLE_MESSAGE.updatedRoleSuccess,
      data,
    );
  }

  async assignRoleToUser(userId: number, roleId: number) {
    // Check if user and role exist
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, }
      }),
      this.prisma.role.findUnique({
        where: { id: roleId },
        select: { id: true, }
      }),
    ]);

    if (!user) {
      throw new AppException(
        ROLE_MESSAGE.userNotFound,
        HttpStatus.NOT_FOUND,
      );
    }


    if (!role) {
      throw new AppException(
        ROLE_MESSAGE.roleNotFound,
        HttpStatus.NOT_FOUND,
      );
    }


    const existingRole = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });

    if (existingRole) {
      return new ResponseModel(
        HttpStatus.OK,
        ROLE_MESSAGE.alreadyAssigned,
      );

      // Throw error
      // throw new AppException(
      //   ROLE_MESSAGE.alreadyAssigned,
      //   HttpStatus.CONFLICT,
      // );
    }

    try {
      await this.prisma.userRole.create({
        data: { userId, roleId },
      });
    } catch (error) {
      // Unique constraint
      if (error.code === 'P2002') {
        return new ResponseModel(
          HttpStatus.OK,
          getMessage(ROLE_MESSAGE.alreadyAssigned),
        );
      }
      throw error;
    }

    // Clear cache
    this.cache.delete(`permissions:user:${userId}`);

    return new ResponseModel(
      HttpStatus.CREATED,
      getMessage(ROLE_MESSAGE.roleAssignedSuccess),
    );
  }


  async removeRoleFromUser(userId: number, roleId: number) {
    // Business rule
    const userRoleCount = await this.prisma.userRole.count({
      where: { userId },
    });

    if (userRoleCount === 1) {
      throw new AppException(
        ROLE_MESSAGE.cannotRemoveLastRole,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if assignment exists
    const userRole = await this.prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
      include: {
        user: { select: { id: true, } },
        role: { select: { id: true, } },
      }
    });

    if (!userRole) {
      throw new AppException(
        ROLE_MESSAGE.roleAssignNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    this.cache.delete(`permissions:user:${userId}`);

    return new ResponseModel(
      HttpStatus.OK,
      ROLE_MESSAGE.roleRemovedSuccess,
    );
  }

  async updateRolePermissions(
    roleId: number,
    permissions: UpdateRolePermissionDto[],
  ) {
    await this.findById(roleId);

    await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        permissions.map(async ({ page, ...updateFields }) => {
          const fieldsToUpdate = Object.fromEntries(
            Object.entries(updateFields).filter(([_, value]) => value !== undefined)
          );

          if (Object.keys(fieldsToUpdate).length === 0) return;

          await tx.rolePermission.upsert({
            where: { roleId_page: { roleId, page } },
            create: {
              roleId,
              page,
              ...fieldsToUpdate,
            },
            update: fieldsToUpdate,
          });
        }),
      );

      await this.invalidateRoleCache(roleId);
    });

    return new ResponseModel(
      HttpStatus.OK,
      getMessage(ROLE_MESSAGE.permissionsUpdatedSuccess),
    );
  }

  private async invalidateRoleCache(roleId: number) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });

    const userIds = [...new Set(userRoles.map(ur => ur.userId))];

    userIds.forEach(userId => {
      this.cache.delete(`permissions:user:${userId}`);
    });
  }
}