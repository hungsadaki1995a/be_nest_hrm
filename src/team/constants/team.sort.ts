import { Prisma } from '@prisma/client';

export enum TeamSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
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
