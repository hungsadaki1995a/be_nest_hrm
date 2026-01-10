import { AppException } from '@/app.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TEAM_ERROR_MESSAGE } from './constants/team.error.constant';
import { TEAM_SELECT_PROPERTIES } from './constants/team.select.constant';
import { TeamCreateDto, TeamUpdateDto } from './dtos/team.input.dto';
import { TeamSearchDto } from './dtos/team.search.dto';
import { buildTeamWhere } from './queries/team.search.query';
import { normalizePaginationAndSort } from '@/utils/pagination-sort.util';
import { buildPagination } from '@/utils/search.util';
import {
  TEAM_SORT_MAP,
  TeamSortFieldEnum,
} from './constants/team.sort.constant';
import { applySortOrder } from '@/utils/sort-transformer.util';
import { getMessage } from '@/utils/message.util';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { handlePrismaError } from '@/prisma/prisma-error.handler';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  private handleNotFoundError(field: string) {
    throw new AppException(
      getMessage(ERROR_MESSAGE.notFound, [field]),
      HttpStatus.NOT_FOUND,
    );
  }

  private async validateDepartment(departmentId?: number | null) {
    if (departmentId === undefined || departmentId === null) return;

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      this.handleNotFoundError('Department');
    }
  }

  private async validateLeader(leaderId?: number | null) {
    if (leaderId === undefined || leaderId === null) return;

    const user = await this.prisma.user.findUnique({
      where: { id: leaderId },
      select: { id: true },
    });

    if (!user) {
      this.handleNotFoundError('Leader');
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
      this.handleNotFoundError(missing.join(', '));
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
      handlePrismaError(e, { module: 'Team', entity: 'Team' });
    }
  }

  async findAll(query: TeamSearchDto) {
    const { page, limit, sortBy, orderBy } = normalizePaginationAndSort(query, {
      sortBy: TeamSortFieldEnum.CREATED_AT,
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
      this.handleNotFoundError('Team');
    }

    return team;
  }

  async update(id: number, payload: TeamUpdateDto) {
    const { memberIds, ...teamData } = payload;

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
      handlePrismaError(e, { module: 'Team', entity: 'Team' });
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
