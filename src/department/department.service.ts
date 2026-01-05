import { AppException } from '@/app.exception';
import { normalizePaginationAndSort } from '@/common/helpers';
import { buildPagination } from '@/common/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { departmentError } from './constants/department.error';
import { departmentSelect } from './constants/department.select';
import {
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from './dto/department.input.dto';
import { DepartmentSearchDto } from './dto/department.search.dto';
import { buildDepartmentWhere } from './queries/department.search';

@Injectable()
export class DepartmentService {
  // private readonly userCache = new Map<number, { id: number }>();

  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaUniqueError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new AppException(departmentError.codeExisted);
      }
    }
    throw e;
  }

  private async validateHeadUser(headId?: number | null) {
    if (headId === undefined || headId === null) return;

    // if (this.userCache.has(headId)) return;

    const user = await this.prisma.user.findUnique({
      where: { id: headId },
      select: { id: true },
    });

    if (!user) {
      throw new AppException(departmentError.headNotFound);
    }

    // this.userCache.set(headId, user);
  }

  private async ensureDepartmentExists(id: number): Promise<void> {
    const exists = await this.prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppException(departmentError.notFound);
    }
  }

  async create(payload: DepartmentCreateDto) {
    // this.userCache.clear();

    await this.validateHeadUser(payload.headId);

    try {
      return await this.prisma.department.create({
        data: payload,
        select: departmentSelect,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async findAll(query: DepartmentSearchDto) {
    const {
      page,
      limit,
      sortBy,
      orderBy: sortOrder,
    } = normalizePaginationAndSort(query);

    const where = buildDepartmentWhere(query);
    const { skip, take } = buildPagination(page, limit);
    const orderBy: Prisma.DepartmentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take,
        orderBy,
        select: departmentSelect,
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
      select: departmentSelect,
    });

    if (!department) {
      throw new AppException(departmentError.notFound);
    }

    return department;
  }

  async update(id: number, payload: DepartmentUpdateDto) {
    // this.userCache.clear();

    await this.ensureDepartmentExists(id);
    await this.validateHeadUser(payload.headId);

    try {
      return await this.prisma.department.update({
        where: { id },
        data: payload,
        select: departmentSelect,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async delete(id: number) {
    await this.ensureDepartmentExists(id);

    const usedCount = await this.prisma.team.count({
      where: { departmentId: id },
    });

    if (usedCount > 0) {
      throw new AppException(departmentError.teamAssigned);
    }

    await this.prisma.department.delete({ where: { id } });

    return { message: departmentError.deleteSuccess };
  }
}
