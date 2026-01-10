import { ApiResponse } from '@/decorators/api-response.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
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

@ApiTags('Role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse(RoleCreateDto)
  create(@Body() payload: RoleCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiResponse(RoleResponseDto, true)
  getAll(@Query() query: RoleSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse(RoleResponseDto)
  async getByEmployeeId(@Param('id', ParseIntPipe) id: number) {
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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.service.update(id, payload);
  }
}
