import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PermissionPageCodeEnum,
  PermissionResponseDto,
} from './dto/permission-reponse.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getPermissions(employeeId: string): Promise<PermissionResponseDto> {
    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new UnauthorizedException();
    }

    let result: PermissionResponseDto = {
      permissions: {
        [PermissionPageCodeEnum.DASHBOARD]: [],
        [PermissionPageCodeEnum.USER]: [],
        [PermissionPageCodeEnum.ROLE]: [],
        [PermissionPageCodeEnum.PERMISSION]: [],
        [PermissionPageCodeEnum.DEPARTMENT]: [],
        [PermissionPageCodeEnum.TEAM]: [],
      },
    };

    for (const roleObj of employee.roles) {
      for (const permission of roleObj.role.permissions) {
        const page = permission.page as unknown as PermissionPageCodeEnum;
        if (!result[page]) {
          result.permissions[page] = [];
        }

        if (permission.canCreate) {
          result.permissions[page].push('C');
        }

        if (permission.canRead) {
          result.permissions[page].push('R');
        }

        if (permission.canUpdate) {
          result.permissions[page].push('U');
        }

        if (permission.canDelete) {
          result.permissions[page].push('D');
        }
      }
    }

    //TODO: Just for dummy data
    result = {
      permissions: {
        [PermissionPageCodeEnum.DASHBOARD]: ['C', 'R', 'U', 'D'],
        [PermissionPageCodeEnum.DEPARTMENT]: ['C', 'R', 'U', 'D'],
        [PermissionPageCodeEnum.ROLE]: ['C', 'R', 'U', 'D'],
        [PermissionPageCodeEnum.TEAM]: ['C', 'R', 'U', 'D'],
        [PermissionPageCodeEnum.USER]: ['C', 'R', 'U', 'D'],
        [PermissionPageCodeEnum.PERMISSION]: ['C', 'R', 'U', 'D'],
      },
    };

    return result;
  }
}
