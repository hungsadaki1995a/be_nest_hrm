import { SortField } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum TeamSortField {
  CREATED_AT = SortField.CREATED_AT,
  UPDATED_AT = SortField.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
  DEPARTMENT = 'department',
  LEADER = 'leader',
}

export const TEAM_SORT_MAP: Record<
  TeamSortField,
  Prisma.TeamOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
  department: { department: { name: 'asc' } },
  leader: { leader: { fullName: 'asc' } },
};
