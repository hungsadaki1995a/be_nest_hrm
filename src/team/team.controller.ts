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
import { TeamDto, TeamResponseDto, TeamUpdateDto } from './team.dto';
import { TeamService } from './team.service';

@ApiTags('Teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('teams')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  @Post()
  create(@Body() payload: TeamDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiOkResponse({ type: [TeamResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TeamResponseDto })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiBody({ type: TeamUpdateDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: TeamUpdateDto,
  ) {
    return this.service.update(id, payload);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Team ID',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
