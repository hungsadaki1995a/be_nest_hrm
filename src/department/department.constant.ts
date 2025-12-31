export const departmentSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  head: true,
  teams: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
};

export const departmentError = {
  notFound: 'Department not found',
  headNotFound: 'Head user not found',
  codeExisted: 'Department code already exists',
  teamAssigned: 'Department has teams assigned',
  deleteSuccess: 'Department deleted successfully',
};
