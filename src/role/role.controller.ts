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
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleDto, RoleResponseDto } from './role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @Post()
  create(@Body() payload: RoleDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiOkResponse({ type: [RoleResponseDto] })
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
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

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: RoleDto) {
    return this.service.update(id, payload);
  }
}
