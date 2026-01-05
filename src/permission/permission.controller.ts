import { Controller, Get, Param } from '@nestjs/common';
import { PermissionResponseDto } from './dto/permission-reponse.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get(':employeeId')
  async getPermissions(
    @Param('employeeId') employeeId: string,
  ): Promise<PermissionResponseDto> {
    const permissions = await this.permissionService.getPermissions(employeeId);
    return permissions;
  }
}
