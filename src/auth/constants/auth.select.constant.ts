import {
  ROLE_SELECT,
  SELECT_USER_PROPERTIES,
} from '@/constants/select.constant';

export const AUTH_SELECT = {
  id: true,
  password: true,
  userId: true,
  status: true,
  user: {
    select: {
      ...SELECT_USER_PROPERTIES,
      roles: {
        select: {
          role: {
            select: ROLE_SELECT,
          },
        },
      },
    },
  },
};
