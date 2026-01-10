import { ROLE_SELECT } from '@/constants/select.constant';

export const USER_SELECT_PROPERTIES = {
  id: true,
  employeeId: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  roles: {
    select: {
      role: {
        select: ROLE_SELECT,
      },
    },
  },
} as const;
