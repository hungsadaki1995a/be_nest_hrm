export const userListSelectFields = {
  id: true,
  employeeId: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  avatarUrl: true,
  dateOfBirth: true,
  onBoardAt: true,
  isActive: true,
  gender: true,
  roles: {
    select: {
      role: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  },
} as const;

export const userDetailSelectFields = {
  id: true,
  employeeId: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  avatarUrl: true,
  dateOfBirth: true,
  onBoardAt: true,
  isActive: true,
  gender: true,
  address: true,
  identityId: true,
  roles: {
    select: {
      role: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  },
} as const;
