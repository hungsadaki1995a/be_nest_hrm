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
import { TeamCreateDto, TeamUpdateDto } from './dto/team.input.dto';
import { TeamResponseDto } from './dto/team.response.dto';
import { TeamSearchDto } from './dto/team.search.dto';
import { TeamService } from './team.service';

@ApiTags('Teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('teams')
export class TeamController extends BaseController {
  constructor(private readonly service: TeamService) {
    super();
  }

  @Post()
  @ApiResponse(TeamResponseDto)
  @ApiOperation({
    summary: 'Create team',
    description: 'Create a new team',
  })
  create(@Body() payload: TeamCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiResponse(TeamResponseDto, true)
  @ApiOperation({
    summary: 'Get all teams',
    description: 'Retrieve all teams with optional filters',
  })
  findAll(@Query() query: TeamSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiResponse(TeamResponseDto)
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique team identifier',
  })
  @ApiOperation({
    summary: 'Get team by ID',
    description: 'Retrieve a single team by its unique identifier',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiResponse(TeamResponseDto)
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique team identifier',
  })
  @ApiOperation({
    summary: 'Update team',
    description: 'Update an existing team',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: TeamUpdateDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Team deleted successfully' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique team identifier',
  })
  @ApiOperation({
    summary: 'Delete team',
    description: 'Delete a team',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
  }
}
