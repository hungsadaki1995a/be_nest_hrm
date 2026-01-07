export const TEAM_SELECT_PROPERTIES = {
  id: true,
  code: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  department: {
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
    },
  },
  leader: {
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      phoneNumber: true,
    },
  },
  members: {
    select: {
      user: {
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  },
} as const;
