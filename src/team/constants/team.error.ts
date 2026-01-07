export const TEAM_ERROR_MESSAGE = {
  departmentNotFound: 'Department not found',
  codeExisted: 'Team code already exists',
  notFound: 'Team not found',
  leaderNotFound: 'Team leader not found',
  userNotFound: 'Users not found:',
  cannotDelete: 'Cannot delete. There are still have users in team',
  deleteSuccess: 'Team delete successfully',
  leaderCannotBeMember:
    'Leader cannot be both leader and member in the same team.',
  memberExists: 'There are still have member(s) in team',
} as const;
