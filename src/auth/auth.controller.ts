import { ApiResponse } from '@/decorators/api-response.decorator';
import { PermissionUserResponseDto } from '@/permission/dto/permission-user-response.dto';
import { PermissionService } from '@/permission/permission.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OtpService } from './otp.service';
import { ApiResponseMessage } from '@/decorators/api-response-message.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private permissionService: PermissionService,
    private otpService: OtpService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.employeeId, dto.password);
  }

  @Post()
  @ApiExcludeEndpoint()
  create() {
    return this.service.create();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Req() req: { user: { employeeId: string } }) {
    return this.service.getProfile(req.user.employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('permissions')
  @ApiResponse(PermissionUserResponseDto)
  getPermissions(@Req() req: { user: { employeeId: string } }) {
    return this.permissionService.getPermissionsByEmployee(req.user.employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiCreatedResponse({ description: 'Logout successful' })
  logout(@Req() req: Request) {
    return this.service.logout(req);
  }

  @Post('refresh-token')
  @ApiCreatedResponse({ description: 'Token refreshed successfully' })
  async refreshToken(@Req() req: Request) {
    return await this.service.refreshToken(req);
  }

  @Post('send-otp')
  @ApiResponseMessage()
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto);
  }

  @Post('verify-otp')
  @ApiResponseMessage()
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto);
  }
}
