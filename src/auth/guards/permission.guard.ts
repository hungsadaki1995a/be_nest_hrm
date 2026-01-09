import { CacheService } from '@/cache/cache.service';
import { CACHE_TIME_LIMIT } from '@/constants/auth.constant';
import { IS_PUBLIC_KEY } from '@/decorators/is-public.decorator';
import { PERMISSION_KEY, PermissionKey } from '@/decorators/permission.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Page } from '@prisma/client';

interface UserPermission {
  page: Page;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private cache: CacheService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionKey[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions?.length) return true;

    const request = context.switchToHttp().getRequest();

    const userId = request.user?.sub;

    if (!userId) throw new ForbiddenException('User not authenticated');

    const userPermissions = await this.getUserPermissions(userId);
    const hasPermission = this.checkPermissions(
      userPermissions,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private async getUserPermissions(userId: number): Promise<UserPermission[]> {
    const cacheKey = `permissions:user:${userId}`;

    let permissions = this.cache.get<UserPermission[]>(cacheKey);

    if (!permissions) {
      permissions = await this.prisma.rolePermission.findMany({
        where: {
          role: {
            users: {
              some: {
                userId,
                user: { isActive: true },
              },
            },
            isActive: true,
          },
        },
        select: {
          page: true,
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
        },
      });

      // Cache for 5 minutes
      this.cache.set(cacheKey, permissions, CACHE_TIME_LIMIT);
    }

    return permissions;
  }

  private checkPermissions(
    userPermissions: UserPermission[],
    required: PermissionKey[],
  ): boolean {
    return required.every((perm) => {
      const [page, action] = perm.split('.');
      return userPermissions.some(
        (p) => p.page === page && p[action as keyof UserPermission] === true,
      );
    });
  }
}
