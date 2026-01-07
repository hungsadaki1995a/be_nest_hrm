import { SortField } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum DepartmentSortField {
  CREATED_AT = SortField.CREATED_AT,
  UPDATED_AT = SortField.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
  HEAD = 'head',
}

export const DEPARTMENT_SORT_MAP: Record<
  DepartmentSortField,
  Prisma.DepartmentOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
  head: { head: { fullName: 'asc' } },
};
