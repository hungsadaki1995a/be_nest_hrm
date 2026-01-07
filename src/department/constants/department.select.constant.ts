import { SELECT_USER_PROPERTIES } from '@/constants/select.constant';

export const DEPARTMENT_SELECT_PROPERTIES = {
  id: true,
  code: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  head: {
    select: SELECT_USER_PROPERTIES,
  },
  teams: {
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
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
    },
  },
} as const;
