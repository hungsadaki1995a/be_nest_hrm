import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post()
  create() {
    return this.service.create();
  }

  @Get(':employeeId')
  async getByEmployeeId(@Param('employeeId') employeeId: string) {
    if (!employeeId) {
      throw new BadRequestException('Employee Id is required');
    }

    const auth = await this.service.findByEmployeeId(employeeId);

    if (!auth) {
      throw new NotFoundException('Employee not found');
    }

    return auth;
  }
}
