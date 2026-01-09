import { AppException } from '@/app.exception';
import { ApiResponse } from '@/decorators/api-response.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserSearchDto } from './dto/user-search.dto';
import { UsersService } from './users.service';
import { BaseController } from '@/controllers/base.controller';
import { UserCreateDto } from './dtos/user.input.dto';
import { UserResponseDto } from './dtos/user.response.dto';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private service: UsersService) {
    super();
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Create new user',
  })
  create(@Body() payload: UserCreateDto) {
    return this.service.create(payload);
  }

  @Get()
  @ApiResponse(UserResponseDto, true)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users with optional filters',
  })
  findAll(@Query() query: UserSearchDto) {
    return this.service.findAll(query);
  }

  @Get(':employeeId')
  @ApiResponse(UserDetailDto)
  async getByEmployeeId(@Param('employeeId') employeeId: string) {
    if (!employeeId) {
      throw new AppException('Employee Id is required');
    }

    const employee = await this.service.findByEmployeeId(employeeId);

    return employee;
  }

  @Put(':employeeId')
  update(
    @Param('employeeId') employeeId: string,
    @Body() payload: UserUpdateDto,
  ) {
    return this.service.update(employeeId, payload);
  }
}
