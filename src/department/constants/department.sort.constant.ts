import { SortFieldEnum } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum DepartmentSortFieldEnum {
  CREATED_AT = SortFieldEnum.CREATED_AT,
  UPDATED_AT = SortFieldEnum.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
  HEAD = 'head',
}

export const DEPARTMENT_SORT_MAP: Record<
  DepartmentSortFieldEnum,
  Prisma.DepartmentOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
  head: { head: { fullName: 'asc' } },
};
