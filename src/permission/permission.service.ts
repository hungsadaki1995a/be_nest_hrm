import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type Permission = {
  canCreate: boolean | null;
  canRead: boolean | null;
  canUpdate: boolean | null;
  canDelete: boolean | null;
  page: { code: string };
};

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getUserPermissions(employeeId: string) {
    const user = await this.prisma.user.findUnique({
      where: { employeeId },
      include: {
        group: {
          include: {
            permissions: {
              include: {
                page: true,
              },
            },
          },
        },
      },
    });

    console.log('user', user);

    const result: Record<string, string[]> = {};

    if (!user || !user.group) {
      throw new NotFoundException('User or group not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const permissions = user.group.permissions as Permission[];

    for (const perm of permissions) {
      const actions: string[] = [];

      if (perm.canCreate) actions.push('C');
      if (perm.canRead) actions.push('R');
      if (perm.canUpdate) actions.push('U');
      if (perm.canDelete) actions.push('D');

      result[perm.page.code] = actions;
    }

    return result;
  }
}
