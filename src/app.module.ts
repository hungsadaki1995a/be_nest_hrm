import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import auth from './config/auth';
import mailer from './config/mailer';
import { PrismaModule } from './prisma/prisma.module';
import { TOKEN_EXPIRE_DEFAULT } from './constants/expired.constant';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [auth, mailer],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('auth.jwt.accessToken.secret', 'fallback'),
          signOptions: {
            expiresIn: config.get(
              'auth.jwt.accessToken.exp',
              TOKEN_EXPIRE_DEFAULT,
            ),
          },
        } as JwtModuleOptions;
      },
    }),
    PrismaModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule,
    DepartmentModule,
    TeamModule,
  ],
})
export class AppModule {}
