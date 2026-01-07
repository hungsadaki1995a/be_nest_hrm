export const TEAM_ERROR_MESSAGE = {
  notFound: 'Team not found',
  codeExisted: 'Team code already exists',
  departmentNotFound: 'Department not found',
  leaderNotFound: 'Team leader not found',
  userNotFound: 'Users not found:',
  cannotDelete: 'Cannot delete. There are still have user(s) in team',
  deleteSuccess: 'Team delete successfully',
  leaderCannotBeMember:
    'Leader cannot be both leader and member in the same team.',
} as const;
