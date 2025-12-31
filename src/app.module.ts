import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PermissionService } from './permission/permission.service';
import { PermissionController } from './permission/permission.controller';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    AppController,
    PermissionController,
    GroupController,
    RoleController,
    UsersController,
    DepartmentController,
    TeamController,
  ],
  providers: [
    AppService,
    PermissionService,
    GroupService,
    RoleService,
    UsersService,
    DepartmentService,
    TeamService,
  ],
})
export class AppModule {}
