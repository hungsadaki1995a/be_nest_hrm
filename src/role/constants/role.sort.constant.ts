import { SortField } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum RoleSortField {
  CREATED_AT = SortField.CREATED_AT,
  UPDATED_AT = SortField.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
}

export const ROLE_SORT_MAP: Record<
  RoleSortField,
  Prisma.TeamOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
};
