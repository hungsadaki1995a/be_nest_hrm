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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { DepartmentSearchDto } from './dto/department.search.dto';
import {
  DepartmentCreateDto,
  DepartmentUpdateDto,
} from './dto/department.input.dto';
import { DepartmentResponseDto } from './dto/department.response.dto';

@ApiTags('Department')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  create(@Body() payload: DepartmentCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({
    name: 'head',
    required: false,
  })
  @ApiQuery({
    name: 'team',
    required: false,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  findAll(@Query() query: DepartmentSearchDto) {
    return this.service.findAll(query);
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
