import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.employeeId, dto.password);
  }

  @Post()
  create() {
    return this.service.create();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: { employeeId: string } }) {
    console.log('Get Profile request data', req);
    return this.service.getProfile(req.user.employeeId);
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
