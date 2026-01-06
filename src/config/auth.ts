import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access-secret-fallback',
      exp: process.env.JWT_ACCESS_TOKEN_EXPIRE || '1d',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-secret-fallback',
      exp: process.env.JWT_REFRESH_TOKEN_EXPIRE || '7d',
    },
  },
  cookie: {
    refreshToken: {
      name: 'refreshToken',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE || '604800') * 1000,
    },
  },
}));
