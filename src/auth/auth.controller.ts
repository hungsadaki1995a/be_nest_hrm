import { ApiResponse } from '@/decorators/api-response.decorator';
import { PermissionUserResponseDto } from '@/permission/dto/permission-user-response.dto';
import { PermissionService } from '@/permission/permission.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.input.dto';
import { SendOtpDto } from './dtos/send-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OtpService } from './otp.service';
import { ApiResponseMessage } from '@/decorators/api-response-message.decorator';
import { BaseController } from '@/controllers/base.controller';
import { LoginResponseDto } from './dtos/auth.response.dto';
import { IsPublic } from '@/decorators/is-public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private service: AuthService,
    private permissionService: PermissionService,
    private otpService: OtpService,
  ) {
    super();
  }

  @Post('login')
  @ApiResponse(LoginResponseDto)
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.employeeId, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiResponse(LoginResponseDto)
  @ApiOperation({
    summary: 'Get profile',
    description: 'Get current user profile',
  })
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

  @IsPublic()
  @Post('send-otp')
  @ApiResponseMessage({ message: 'OTP sent successful' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto);
  }

  @IsPublic()
  @Post('verify-otp')
  @ApiResponseMessage({ message: 'Verify OTP successful' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto);
  }
}
