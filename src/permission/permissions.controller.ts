import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PermissionDto } from './dto/permission.dto';
import { PermissionService } from './permission.service';
import { ApiResponse } from '@/decorators/api-response.decorator';

@Controller('permissions')
export class PermissionController {
  constructor(private service: PermissionService) {}

  @Get('/role/:roleId')
  @ApiResponse(PermissionDto)
  async getPermissionsByRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<PermissionDto> {
    const permissions = await this.service.getPermissionsByRole(roleId);
    return permissions;
  }

  @Post()
  create(@Body() payload: PermissionDto) {
    return this.service.updateRolePermission(payload);
  }
}
