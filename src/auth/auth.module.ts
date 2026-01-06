import { PermissionModule } from '@/permission/permission.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PermissionModule,
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService],
})
export class AuthModule {}
