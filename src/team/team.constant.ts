export const teamSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  department: true,
  leader: true,
  members: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
};

export const teamError = {
  departmentNotFound: 'Department not found',
  codeExisted: 'Team code already exists',
  notFound: 'Team not found',
  leaderNotFound: 'Team leader not found',
  userNotFound: 'Users not found:',
  cannotDelete: 'Cannot delete. There are still have users in team',
  deleteSuccess: 'Team deleted successfully',
};
