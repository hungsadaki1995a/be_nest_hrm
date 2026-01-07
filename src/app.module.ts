import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import auth from './config/auth';
import mailer from './config/mailer';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TOKEN_EXPIRE_DEFAULT } from './constants/expired.constant';

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
  ],
  controllers: [
    AppController,
    PermissionController,
    RoleController,
    UsersController,
    DepartmentController,
    TeamController,
  ],
  providers: [
    AppService,
    PermissionService,
    RoleService,
    UsersService,
    DepartmentService,
    TeamService,
  ],
})
export class AppModule {}
