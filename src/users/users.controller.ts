import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

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
}
