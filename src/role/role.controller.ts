import { ApiResponse } from '@/decorators/api-response.decorator';
import { Permission } from '@/decorators/permission.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { PermissionGuard } from '@guards/permission.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCreateDto, UpdateRoleDto } from './dtos/role.input.dto';
import { RoleResponseDto } from './dtos/role.response.dto';
import { RoleSearchDto } from './dtos/role.search.dto';
import { RoleService } from './role.service';
import { UpdateRolePermissionsDto } from './dtos/role-permission.input.dto';

@ApiTags('Role')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
@Controller('roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @Post()
  @Permission('ROLE.canCreate') 
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse(RoleCreateDto)
  create(@Body() payload: RoleCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @Permission('ROLE.canRead')
  @ApiResponse(RoleResponseDto, true)
  getAll(@Query() query: RoleSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permission('ROLE.canRead')
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse(RoleResponseDto)
  async getById(@Param('id', ParseIntPipe) id: number) {
    if (!id) {
      throw new BadRequestException('Role Id is required');
    }

    const role = await this.service.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  @Delete(':id')
  @Permission('ROLE.canDelete')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Patch(':id')
  @Permission('ROLE.canUpdate')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.service.update(id, payload);
  }

  @Patch(':roleId/permissions')
  @Permission('ROLE.canUpdate')
  @ApiOperation({ summary: 'Update role permissions (partial update)' })
  updatePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() payload: UpdateRolePermissionsDto,
  ) {
    return this.service.updateRolePermissions(roleId, payload.permissions);
  }

  @Post(':roleId/users/:userId')
  @Permission('ROLE.canUpdate')
  @ApiOperation({ summary: 'Assign role to user' })
  assignToUser(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.service.assignRoleToUser(userId, roleId);
  }

  @Delete(':roleId/users/:userId')
  @Permission('ROLE.canDelete')
  @ApiOperation({ summary: 'Remove role from user' })
  removeFromUser(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.service.removeRoleFromUser(userId, roleId);
  }
}