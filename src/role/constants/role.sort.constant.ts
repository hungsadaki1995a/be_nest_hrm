import { SortFieldEnum } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum RoleSortFieldEnum {
  CREATED_AT = SortFieldEnum.CREATED_AT,
  UPDATED_AT = SortFieldEnum.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
}

export const ROLE_SORT_MAP: Record<
  RoleSortFieldEnum,
  Prisma.TeamOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
};
