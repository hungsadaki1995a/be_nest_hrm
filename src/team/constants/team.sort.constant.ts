import { SortFieldEnum } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum TeamSortFieldEnum {
  CREATED_AT = SortFieldEnum.CREATED_AT,
  UPDATED_AT = SortFieldEnum.UPDATED_AT,
  CODE = 'code',
  NAME = 'name',
  DEPARTMENT = 'department',
  LEADER = 'leader',
}

export const TEAM_SORT_MAP: Record<
  TeamSortFieldEnum,
  Prisma.TeamOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  code: { code: 'asc' },
  name: { name: 'asc' },
  department: { department: { name: 'asc' } },
  leader: { leader: { fullName: 'asc' } },
};
