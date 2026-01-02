import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { teamError } from './constants/team.error';
import { AppException } from '@/app.exception';
import { teamSelect } from './constants/team.select';
import { TeamCreateDto, TeamUpdateDto } from './dto/team.input.dto';

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
      connect: memberIds.map((id) => ({ id })),
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

  async findAll() {
    return await this.prisma.team.findMany({
      // where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: teamSelect,
    });
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

    const usedCount = await this.prisma.user.count({
      where: { teamId: id },
    });

    if (usedCount > 0) {
      throw new AppException(teamError.cannotDelete);
    }

    await this.prisma.team.delete({ where: { id } });

    return { message: teamError.deleteSuccess };
  }
}
