import { AppException } from '@/app.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DEPARTMENT_ERROR_MESSAGE } from './constants/department.error.constant';
import { DEPARTMENT_SELECT_PROPERTIES } from './constants/department.select.constant';
import {
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from './dtos/department.input.dto';
import { DepartmentSearchDto } from './dtos/department.search.dto';
import { buildDepartmentWhere } from './queries/department.search';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { buildPagination } from '@/utils/search.util';
import {
  DEPARTMENT_SORT_MAP,
  DepartmentSortFieldEnum,
} from './constants/department.sort.constant';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { getMessage } from '@/utils/message.util';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaUniqueError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new AppException(
          getMessage(DEPARTMENT_ERROR_MESSAGE.codeExisted),
        );
      }
    }
    throw e;
  }

  private async validateHeadUser(headId?: number | null) {
    if (headId === undefined || headId === null) {
      throw new AppException(
        getMessage(DEPARTMENT_ERROR_MESSAGE.headIdNotExisted),
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: headId },
      select: { id: true },
    });

    if (!user) {
      throw new AppException(getMessage(DEPARTMENT_ERROR_MESSAGE.headNotFound));
    }
  }

  private async validateTeams(teamIds?: number[]) {
    if (!teamIds || teamIds.length === 0) return;

    const teams = await this.prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true },
    });

    const foundIds = teams.map((u) => u.id);
    const missing = teamIds.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      throw new AppException(
        getMessage(DEPARTMENT_ERROR_MESSAGE.teamNotFound, [missing.join(', ')]),
      );
    }
  }

  private async ensureDepartmentExists(id: number): Promise<void> {
    const exists = await this.prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppException(getMessage(DEPARTMENT_ERROR_MESSAGE.notFound));
    }
  }

  private mapTeamIdsToCreate(teamIds?: number[]) {
    if (!teamIds?.length) return undefined;

    return {
      connect: teamIds.map((id) => ({ id })),
    };
  }

  async create(payload: DepartmentCreateDto) {
    const { teamIds, ...departmentData } = payload;

    await this.validateHeadUser(departmentData.headId);
    await this.validateTeams(teamIds);

    try {
      return await this.prisma.department.create({
        data: {
          ...departmentData,
          teams: this.mapTeamIdsToCreate(teamIds),
        },
        select: DEPARTMENT_SELECT_PROPERTIES,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async findAll(query: DepartmentSearchDto) {
    const { page, limit, sortBy, orderBy } = normalizePaginationAndSort(query, {
      sortBy: DepartmentSortFieldEnum.CREATED_AT,
    });

    const prismaOrderBy = applySortOrder(DEPARTMENT_SORT_MAP[sortBy], orderBy);
    const where = buildDepartmentWhere(query);
    const { skip, take } = buildPagination(page, limit);

    const [items, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take,
        orderBy: prismaOrderBy,
        select: DEPARTMENT_SELECT_PROPERTIES,
      }),
      this.prisma.department.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      select: DEPARTMENT_SELECT_PROPERTIES,
    });

    if (!department) {
      throw new AppException(getMessage(DEPARTMENT_ERROR_MESSAGE.notFound));
    }

    return department;
  }

  async update(id: number, payload: DepartmentUpdateDto) {
    const { teamIds, ...departmentData } = payload;

    await this.ensureDepartmentExists(id);
    await this.validateHeadUser(departmentData.headId);
    await this.validateTeams(teamIds);

    try {
      return await this.prisma.department.update({
        where: { id },
        data: { ...departmentData, teams: this.mapTeamIdsToCreate(teamIds) },
        select: DEPARTMENT_SELECT_PROPERTIES,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async delete(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { teams: true },
        },
      },
    });

    if (!department) {
      throw new AppException(getMessage(DEPARTMENT_ERROR_MESSAGE.notFound));
    }

    if (department._count.teams > 0) {
      throw new AppException(getMessage(DEPARTMENT_ERROR_MESSAGE.cannotDelete));
    }

    await this.prisma.department.delete({ where: { id } });

    return { message: DEPARTMENT_ERROR_MESSAGE.deleteSuccess };
  }
}
