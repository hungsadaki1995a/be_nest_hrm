import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersController } from './users.controller';
import { AuthModule } from '@/auth/auth.module';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
