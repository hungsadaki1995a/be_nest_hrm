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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  DepartmentDto,
  DepartmentResponseDto,
  DepartmentUpdateDto,
} from './department.dto';
import { DepartmentService } from './department.service';

@ApiTags('Department')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  create(@Body() payload: DepartmentDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: DepartmentResponseDto })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBody({ type: DepartmentUpdateDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DepartmentUpdateDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Department ID',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
