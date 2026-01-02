import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get(':employeeId')
  async getByEmployeeId(@Param('employeeId') employeeId: string) {
    if (!employeeId) {
      throw new BadRequestException('Employee Id is required');
    }

    const employee = await this.service.findByEmployeeId(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  @Post()
  create(@Body() payload: UserCreateDto) {
    return this.service.create(payload);
  }
}
