import { AppException } from '@/app.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TEAM_ERROR_MESSAGE } from './constants/team.error.constant';
import { TEAM_SELECT_PROPERTIES } from './constants/team.select.constant';
import { TeamCreateDto, TeamUpdateDto } from './dtos/team.input.dto';
import { TeamSearchDto } from './dtos/team.search.dto';
import { buildTeamWhere } from './queries/team.search.query';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { buildPagination } from '@/utils/search.util';
import { TEAM_SORT_MAP, TeamSortField } from './constants/team.sort.constant';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { getMessage } from '@/utils/message.util';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaUniqueError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new AppException(getMessage(TEAM_ERROR_MESSAGE.codeExisted));
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
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.departmentNotFound));
    }
  }

  private async validateLeader(leaderId?: number | null) {
    if (leaderId === undefined || leaderId === null) return;

    const user = await this.prisma.user.findUnique({
      where: { id: leaderId },
      select: { id: true },
    });

    if (!user) {
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.leaderNotFound));
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
      throw new AppException(
        `${TEAM_ERROR_MESSAGE.userNotFound} ${missing.join(', ')}`,
      );
    }
  }

  private async ensureTeamExists(id: number): Promise<void> {
    const exists = await this.prisma.team.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.notFound));
    }
  }

  private mapMemberIdsToCreate(memberIds?: number[]) {
    if (!memberIds?.length) return undefined;

    return {
      create: memberIds.map((id) => ({
        user: { connect: { id } },
      })),
    };
  }

  private mapMemberIdsToUpdate(memberIds?: number[]) {
    if (!memberIds || memberIds.length === 0) return undefined;

    return {
      deleteMany: {},
      create: memberIds.map((userId) => ({
        user: { connect: { id: userId } },
      })),
    };
  }

  private validateLeaderNotInMembers(
    leaderId?: number | null,
    memberIds?: number[] | null,
  ) {
    if (!leaderId || !memberIds?.length) return;

    if (memberIds.includes(leaderId)) {
      throw new AppException(
        getMessage(TEAM_ERROR_MESSAGE.leaderCannotBeMember),
      );
    }
  }

  async create(payload: TeamCreateDto) {
    const { memberIds, ...teamData } = payload;

    await this.validateDepartment(teamData.departmentId);
    await this.validateLeader(teamData.leaderId);
    await this.validateMembers(memberIds);
    this.validateLeaderNotInMembers(teamData.leaderId, memberIds);

    try {
      return await this.prisma.team.create({
        data: {
          ...teamData,
          members: this.mapMemberIdsToCreate(memberIds),
        },
        select: TEAM_SELECT_PROPERTIES,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async findAll(query: TeamSearchDto) {
    const { page, limit, sortBy, orderBy } = normalizePaginationAndSort(query, {
      sortBy: TeamSortField.CREATED_AT,
    });
    const prismaOrderBy = applySortOrder(TEAM_SORT_MAP[sortBy], orderBy);
    const where = buildTeamWhere(query);
    const { skip, take } = buildPagination(page, limit);

    const [items, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take,
        orderBy: prismaOrderBy,
        select: TEAM_SELECT_PROPERTIES,
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
      select: TEAM_SELECT_PROPERTIES,
    });

    if (!team) {
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.notFound));
    }

    return team;
  }

  async update(id: number, payload: TeamUpdateDto) {
    const { memberIds, ...teamData } = payload;

    await this.ensureTeamExists(id);
    await this.validateDepartment(teamData.departmentId);
    await this.validateLeader(teamData.leaderId);
    await this.validateMembers(memberIds);
    this.validateLeaderNotInMembers(teamData.leaderId, memberIds);

    try {
      return await this.prisma.team.update({
        where: { id },
        data: {
          ...teamData,
          members: this.mapMemberIdsToUpdate(memberIds),
        },
        select: TEAM_SELECT_PROPERTIES,
      });
    } catch (e) {
      this.handlePrismaUniqueError(e);
    }
  }

  async delete(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!team) {
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.notFound));
    }

    if (team._count.members > 0) {
      throw new AppException(getMessage(TEAM_ERROR_MESSAGE.cannotDelete));
    }

    await this.prisma.team.delete({ where: { id } });

    return { message: TEAM_ERROR_MESSAGE.deleteSuccess };
  }
}
