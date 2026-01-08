import { PermissionModule } from '@/permission/permission.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';
import { TOKEN_EXPIRE_DEFAULT } from '@/constants/expired.constant';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRE_DEFAULT },
    }),
    PermissionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService],
  exports: [AuthService, OtpService],
})
export class AuthModule {}
