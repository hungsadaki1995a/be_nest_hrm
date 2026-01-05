import { AppException } from '@/app.exception';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserCreateDto } from './dto/create-user.dto';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserListResponseDto } from './dto/user-list-response.dto';
import { UserSearchDto } from './dto/user-search.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserListResponseDto] })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  findAll(@Query() query: UserSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':employeeId')
  @ApiOkResponse({ type: UserDetailDto })
  async getByEmployeeId(@Param('employeeId') employeeId: string) {
    if (!employeeId) {
      throw new AppException('Employee Id is required');
    }

    const employee = await this.service.findByEmployeeId(employeeId);

    return employee;
  }

  @Post()
  create(@Body() payload: UserCreateDto) {
    return this.service.create(payload);
  }
}
