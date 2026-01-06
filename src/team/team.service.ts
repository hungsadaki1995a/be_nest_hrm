import { AppException } from '@/app.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { teamError } from './constants/team.error';
import { teamSelect } from './constants/team.select';
import { TeamCreateDto, TeamUpdateDto } from './dto/team.input.dto';
import { TeamSearchDto } from './dto/team.search.dto';
import { buildTeamWhere } from './queries/team.search';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { buildPagination } from '@/utils/search.util';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaUniqueError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new AppException(teamError.codeExisted);
      }
    }
    throw e;
  }

  private async validateDepartment(departmentId?: number | null) {
    if (departmentId === undefined || departmentId === null) return;

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new AppException(teamError.departmentNotFound);
    }
  }

  private async validateLeader(leaderId?: number | null) {
    if (leaderId === undefined || leaderId === null) return;

    const user = await this.prisma.user.findUnique({
      where: { id: leaderId },
      select: { id: true },
    });

    if (!user) {
      throw new AppException(teamError.leaderNotFound);
    }
  }

  private async validateMembers(memberIds?: number[]) {
    if (!memberIds || memberIds.length === 0) return;

    const users = await this.prisma.user.findMany({
      where: { id: { in: memberIds } },
      select: { id: true },
    });

    const foundIds = users.map((u) => u.id);
    const missing = memberIds.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      throw new AppException(`${teamError.userNotFound} ${missing.join(', ')}`);
    }
  }

  private async ensureTeamExists(id: number): Promise<void> {
    const exists = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppException(teamError.notFound);
    }
  }

  private mapMemberIdsToConnect(memberIds?: number[]) {
    if (!memberIds || memberIds.length === 0) return undefined;

    return {
      deleteMany: {},
      create: memberIds.map((userId) => ({
        user: { connect: { id: userId } },
      })),
    };
  }

  async create(payload: TeamCreateDto) {
    await this.validateDepartment(payload.departmentId);
    await this.validateLeader(payload.leaderId);
    await this.validateMembers(payload.memberIds);

    try {
      return await this.prisma.team.create({
        data: {
          ...payload,
          members: this.mapMemberIdsToConnect(payload.memberIds),
        },
        select: teamSelect,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async findAll(query: TeamSearchDto) {
    const {
      page,
      limit,
      sortBy,
      orderBy: sortOrder,
    } = normalizePaginationAndSort(query);

    const where = buildTeamWhere(query);
    const { skip, take } = buildPagination(page, limit);
    const orderBy: Prisma.DepartmentOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take,
        orderBy,
        select: teamSelect,
      }),
      this.prisma.team.count({ where }),
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
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: teamSelect,
    });

    if (!team) {
      throw new AppException(teamError.notFound);
    }

    return team;
  }

  async update(id: number, payload: TeamUpdateDto) {
    await this.ensureTeamExists(id);
    await this.validateDepartment(payload.departmentId);
    await this.validateLeader(payload.leaderId);
    await this.validateMembers(payload.memberIds);

    try {
      return await this.prisma.team.update({
        where: { id },
        data: {
          ...payload,
          members: this.mapMemberIdsToConnect(payload.memberIds),
        },
        select: teamSelect,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async delete(id: number) {
    await this.ensureTeamExists(id);

    // const usedCount = await this.prisma.user.count({
    //   where: { teamId: id },
    // });

    // if (usedCount > 0) {
    //   throw new AppException(teamError.cannotDelete);
    // }

    await this.prisma.team.delete({ where: { id } });

    return { message: teamError.deleteSuccess };
  }
}
