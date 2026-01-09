import { SetMetadata } from '@nestjs/common';
import { Page } from '@prisma/client';

export type PermissionAction = 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete';
export type PermissionKey = `${Page}.${PermissionAction}`;

export const PERMISSION_KEY = 'permissions';
export const Permission = (...permissions: PermissionKey[]) => 
  SetMetadata(PERMISSION_KEY, permissions);