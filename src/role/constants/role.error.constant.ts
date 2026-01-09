export const ROLE_MESSAGE = {
  codeExisted: 'Role code already exists',
  createSuccess: 'Create Role successful',
  isInteger: '{0} must be a positive integer',
  roleNotFound: 'Role not found',
  updatedRoleSuccess: 'Role updated successfully',
  cannotDelete: 'Cannot delete role. There are still user(s) using this role',
  roleDeletedSuccess: 'Role deleted successfully',
  userNotFound: 'User not found',
  roleAssignedSuccess: "Role assigned successful",
  alreadyAssigned: 'Role already assigned to user',
  cannotAssign: 'Cannot assign role to inactive user',
  inactiveRole: 'Cannot assign inactive role',
  roleRemovedSuccess: 'Role removed success',
  roleAssignNotFound:'Role assignment not found',
  cannotRemoveLastRole:'Cannot remove last role from user',
  permissionsUpdatedSuccess: 'Role permissions updated successfully'
} as const;
