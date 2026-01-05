import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionResponseDto } from './dto/permission-reponse.dto';

// type Permission = {
//   canCreate: boolean | null;
//   canRead: boolean | null;
//   canUpdate: boolean | null;
//   canDelete: boolean | null;
//   page: { code: string };
// };

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
                permissions: {
                  include: { page: true },
                },
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new UnauthorizedException();
    }

    const result: PermissionResponseDto = { permissions: {} };

    for (const roleObj of employee.roles) {
      for (const permission of roleObj.role.permissions) {
        const page = permission.page.code;
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
}
