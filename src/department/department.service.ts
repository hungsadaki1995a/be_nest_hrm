import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentDto, DepartmentUpdateDto } from './department.dto';
import { departmentError, departmentSelect } from './department.constant';

@Injectable()
export class DepartmentService {
  // private readonly userCache = new Map<number, { id: number }>();

  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaUniqueError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new BadRequestException(departmentError.codeExisted);
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
      throw new BadRequestException(departmentError.headNotFound);
    }

    // this.userCache.set(headId, user);
  }

  private async ensureDepartmentExists(id: number): Promise<void> {
    const exists = await this.prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(departmentError.notFound);
    }
  }

  async create(payload: DepartmentDto) {
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

  async findAll() {
    return await this.prisma.department.findMany({
      // where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: departmentSelect,
    });
  }

  async findById(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      select: departmentSelect,
    });

    if (!department) {
      throw new NotFoundException(departmentError.notFound);
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
      throw new BadRequestException(departmentError.teamAssigned);
    }

    await this.prisma.department.delete({ where: { id } });

    return { message: departmentError.deleteSuccess };
  }
}
