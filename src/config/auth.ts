import {
  TOKEN_EXPIRE_DEFAULT,
  REFRESH_TOKEN_EXPIRE_DEFAULT,
} from '@/constants/auth.constant';
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access-secret-fallback',
      exp: TOKEN_EXPIRE_DEFAULT,
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-secret-fallback',
      exp: REFRESH_TOKEN_EXPIRE_DEFAULT,
    },
  },
  cookie: {
    refreshToken: {
      name: 'refreshToken',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: REFRESH_TOKEN_EXPIRE_DEFAULT,
    },
  },
}));
