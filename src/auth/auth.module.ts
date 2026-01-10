import { PermissionModule } from '@/permission/permission.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';

@Module({
  imports: [PermissionModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService],
  exports: [AuthService, OtpService],
})
export class AuthModule {}
