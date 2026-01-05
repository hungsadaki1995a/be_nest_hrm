import { PermissionService } from '@/permission/permission.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private permissionService: PermissionService,
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
  getPermissions(@Req() req: { user: { employeeId: string } }) {
    return this.permissionService.getPermissions(req.user.employeeId);
  }
}
