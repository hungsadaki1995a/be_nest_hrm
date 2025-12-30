import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
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
  get() {
    return this.service.findAll();
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
