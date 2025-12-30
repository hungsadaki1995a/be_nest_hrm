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

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, PermissionController, GroupController, RoleController],
  providers: [AppService, PermissionService, GroupService, RoleService],
})
export class AppModule {}
