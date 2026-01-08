import { BaseController } from '@/controllers/base.controller';
import { ApiResponse } from '@/decorators/api-response.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { DepartmentSearchDto } from './dtos/department.search.dto';
import {
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from './dtos/department.input.dto';
import { DepartmentResponseDto } from './dtos/department.response.dto';
import { DEPARTMENT_ERROR_MESSAGE } from './constants/department.error.constant';

@ApiTags('Department')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('departments')
export class DepartmentController extends BaseController {
  constructor(private readonly service: DepartmentService) {
    super();
  }

  @Post()
  @ApiResponse(DepartmentResponseDto)
  @ApiOperation({
    summary: 'Create department',
    description: 'Create a new department',
  })
  create(@Body() payload: DepartmentCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiResponse(DepartmentResponseDto, true)
  @ApiOperation({
    summary: 'Get all departments',
    description: 'Retrieve all departments with optional filters',
  })
  findAll(@Query() query: DepartmentSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiResponse(DepartmentResponseDto)
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique department identifier',
  })
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieve a single department by its unique identifier',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiResponse(DepartmentResponseDto)
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique department identifier',
  })
  @ApiOperation({
    summary: 'Update department',
    description: 'Update an existing department',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DepartmentUpdateDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: DEPARTMENT_ERROR_MESSAGE.deleteSuccess })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique department identifier',
  })
  @ApiOperation({
    summary: 'Delete department',
    description: 'Delete a department',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
  }
}
