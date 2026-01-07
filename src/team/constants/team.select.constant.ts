import {
  SELECT_DEPARTMENT_PROPERTIES,
  SELECT_USER_PROPERTIES,
} from '@/constants/select.constant';

export const TEAM_SELECT_PROPERTIES = {
  id: true,
  code: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  department: {
    select: SELECT_DEPARTMENT_PROPERTIES,
  },
  leader: {
    select: SELECT_USER_PROPERTIES,
  },
  members: {
    select: {
      user: {
        select: SELECT_USER_PROPERTIES,
      },
    },
  },
} as const;
