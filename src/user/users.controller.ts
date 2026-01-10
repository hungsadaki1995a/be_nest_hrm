import { ApiResponse } from '@/decorators/api-response.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
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
import { BaseController } from '@/controllers/base.controller';
import { UserCreateDto, UserUpdateDto } from './dtos/user.input.dto';
import { UserResponseDto } from './dtos/user.response.dto';
import { UserService } from './user.service';
import { UserSearchDto } from './dtos/user.search.dto';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private service: UserService) {
    super();
  }

  @Post()
  @ApiResponse(UserResponseDto)
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
  @ApiResponse(UserResponseDto)
  @ApiParam({
    name: 'Employee ID',
    type: String,
    example: '1',
    description: 'Unique user identifier',
  })
  @ApiOperation({
    summary: 'Get user by Employee ID',
    description: 'Retrieve a single user by its unique identifier',
  })
  async getEmployeeId(@Param('employeeId') employeeId: string) {
    return await this.service.findByEmployeeId(employeeId);
  }

  @Patch(':employeeId')
  @ApiResponse(UserResponseDto)
  @ApiParam({
    name: 'employeeId',
    type: String,
    example: '1',
    description: 'Unique user identifier',
  })
  @ApiOperation({
    summary: 'Update user by Employee ID',
    description: 'Update an existing user by its unique identifier',
  })
  update(
    @Param('employeeId') employeeId: string,
    @Body() payload: UserUpdateDto,
  ) {
    return this.service.update(employeeId, payload);
  }
}
