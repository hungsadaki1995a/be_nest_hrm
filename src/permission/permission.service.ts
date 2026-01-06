import { AppException } from '@/app.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionPageCodeList } from './consts/permission.const';
import { PermissionPageDto } from './dto/permission-page.dto';
import { PermissionUserResponseDto } from './dto/permission-user-response.dto';
import { PermissionDto } from './dto/permission.dto';
import { PermissionPageCodeEnum } from './enum/permission.enum';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getPermissionsByEmployee(
    employeeId: string,
  ): Promise<PermissionUserResponseDto> {
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
      throw new AppException('User not found');
    }

    let result: PermissionUserResponseDto = {
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

    return result;
  }

  async getPermissionsByRole(roleId: number): Promise<PermissionDto> {
    const rolePermission = await this.prisma.rolePermission.findMany({
      where: { roleId },
    });

    const defaultPermission: PermissionPageDto = {
      canCreate: false,
      canDelete: false,
      canRead: false,
      canUpdate: false,
    };

    const permissions = {};

    for (const pageCode of PermissionPageCodeList) {
      permissions[pageCode] = defaultPermission;
      const pagePermission: PermissionPageDto = rolePermission.find(
        (item) => (item.page as PermissionPageCodeEnum) === pageCode,
      ) as PermissionPageDto;

      if (pagePermission) {
        permissions[pageCode] = {
          canCreate: pagePermission.canCreate,
          canRead: pagePermission.canRead,
          canUpdate: pagePermission.canUpdate,
          canDelete: pagePermission.canDelete,
        };
      }
    }

    const result: PermissionDto = {
      roleId: roleId,
      permissions: permissions as Record<
        PermissionPageCodeEnum,
        PermissionPageDto
      >,
    };

    return result;
  }

  async updateRolePermission(payload: PermissionDto) {
    const { roleId, permissions } = payload;
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new AppException('Role not found');
    }

    try {
      const entries = Object.entries(permissions) as [
        PermissionPageCodeEnum,
        PermissionPageDto,
      ][];
      const actions = entries.map(([page, permission]) =>
        this.prisma.rolePermission.upsert({
          where: {
            roleId_page: {
              roleId,
              page: page,
            },
          },
          update: permission,
          create: {
            roleId,
            page: page,
            ...permission,
          },
        }),
      );

      await this.prisma.$transaction(actions);
    } catch (error) {
      throw new AppException(
        'Unexpected server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getPermissionsByRole(roleId);
  }
}
