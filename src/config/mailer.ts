import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  otp: {
    secret: process.env.OTP_SECRET || 'otp-secret-fallback',
    ttlMinutes: Number(process.env.OTP_TTL_MINUTES) || 10,
  },
}));
