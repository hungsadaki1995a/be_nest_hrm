import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get(':employeeId')
  async getPermissions(@Param('employeeId') employeeId: string) {
    const permissions =
      await this.permissionService.getUserPermissions(employeeId);

    if (!permissions) {
      throw new NotFoundException('User not found');
    }

    return permissions;
  }
}
