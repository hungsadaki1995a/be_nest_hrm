export const AUTH_ERROR_MESSAGE = {
  incorrect: 'User ID or Password incorrect. Try again!',
  inactive: 'User not found or inactive',
  missingHeader: 'Missing or invalid Authorization Header',
  missingToken: 'Missing or invalid Token',
  logoutFailed: 'Logout failed',
  logoutSuccess: 'Logout successfully',
  passwordDoNotMatch: 'Password do not match',
  passwordMatch: '{0} must be different with {1}',
} as const;
