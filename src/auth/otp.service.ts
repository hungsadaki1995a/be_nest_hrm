import { AppException } from '@/app.exception';
import { AuthService } from '@/auth/auth.service';
import {
  MAX_OTP,
  MAX_OTP_ATTEMPT,
  OTP_TIME_LIMIT,
} from '@/constants/auth.constant';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { otpEmailTemplate } from '@/templates/email.templates';
import { safeCompare } from '@/utils/compare-string';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Otp } from '@prisma/client';
import { createHmac, randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResponseModel } from '@/utils/response';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpLength = 6;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private generateOtp(len = this.otpLength): string {
    if (len <= 0) throw new Error('Invalid OTP length');

    const max = 10 ** len;
    return randomInt(0, max).toString().padStart(len, '0');
  }

  private createTransporter(): nodemailer.Transporter {
    const host = this.config.get<string>('mailer.smtp.host', 'smtp.gmail.com');
    const port = Number(this.config.get<number>('mailer.smtp.port', 587));
    const secure =
      this.config.get<boolean>('mailer.smtp.secure', false) === true;
    const user = this.config.get<string>('mailer.smtp.user');
    const pass = this.config.get<string>('mailer.smtp.pass');

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  private hashOtp(otp: string) {
    const secret = this.config.get<string>(
      'mailer.otp.secret',
      'fallback_secret',
    );
    return createHmac('sha256', secret).update(otp).digest('hex');
  }

  async sendOtp(body: SendOtpDto): Promise<{ message: string }> {
    const { email, fullName } = body;

    if (!email) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Email']),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Rate limit
    const fromTime = new Date(Date.now() - OTP_TIME_LIMIT * 60 * 1000);

    const count = await this.prisma.otp.count({
      where: {
        email,
        purpose: 'RESET_PASSWORD',
        createdAt: { gte: fromTime },
      },
    });

    if (count >= MAX_OTP) {
      throw new AppException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Generate OTP
    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    const ttlMinutes = Number(this.config.get<number>('mailer.otp.ttlMinutes'));
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Create OTP
    const newOtp = await this.prisma.otp.create({
      data: {
        email,
        otpHash,
        expiresAt,
        usedAt: null,
        isActive: true,
        purpose: 'RESET_PASSWORD',
      },
    });

    // Revoke old OTP
    const newOtpId: number = newOtp.id;

    await this.prisma.otp.updateMany({
      where: {
        email,
        isActive: true,
        purpose: 'RESET_PASSWORD',
        id: { not: newOtpId },
      },
      data: {
        revokedAt: new Date(),
        isActive: false,
      },
    });

    // Send email
    try {
      const html = otpEmailTemplate({
        fullName,
        email,
        otp,
      });

      const transporter = this.createTransporter();

      await transporter.sendMail({
        from: `"No-Reply" <${this.config.get<string>('mailer.smtp.user')}>`,
        to: email,
        subject: 'Your OTP code',
        html,
      });

      return new ResponseModel(
        HttpStatus.OK,
        getMessage(ERROR_MESSAGE.otpSentSuccess),
      );
    } catch (err) {
      this.logger.error('Failed to send OTP email', err);
      throw err;
    }
  }

  async verifyOtp(body: VerifyOtpDto) {
    const { email, otp, password, confirmPassword } = body;

    this.authService.validateNewPassword(password, confirmPassword);

    await this.prisma.$transaction(async (tx) => {
      // Lock record with FOR UPDATE
      const [record] = await tx.$queryRaw<Otp[]>`
        SELECT
          id,
          "otpHash",
          attempts,
          "expiresAt"
        FROM "otps"
        WHERE email = ${email}
          AND "isActive" = true
          AND "usedAt" IS NULL
        FOR UPDATE
      `;

      console.log({ record });

      if (!record) {
        throw new AppException(
          getMessage(ERROR_MESSAGE.otpNotFound),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (new Date() > record.expiresAt) {
        throw new AppException(
          getMessage(ERROR_MESSAGE.otpExpired),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (record.attempts >= MAX_OTP_ATTEMPT) {
        await tx.otp.updateMany({
          where: { email, isActive: true },
          data: { isActive: false, revokedAt: new Date() },
        });
        throw new AppException(
          getMessage(ERROR_MESSAGE.otpTooManyAttempts),
          HttpStatus.BAD_REQUEST,
        );
      }

      // verify OTP
      const hash = this.hashOtp(otp);
      if (!safeCompare(hash, record.otpHash)) {
        await tx.otp.update({
          where: { id: record.id },
          data: { attempts: { increment: 1 } },
        });
        throw new AppException(
          getMessage(ERROR_MESSAGE.otpInvalid),
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update to used OTP
      const consumeResult = await tx.otp.updateMany({
        where: { id: record.id, isActive: true, usedAt: null },
        data: { isActive: false, usedAt: new Date() },
      });
      if (consumeResult.count === 0) {
        throw new AppException(
          getMessage(ERROR_MESSAGE.otpNotFound),
          HttpStatus.BAD_REQUEST,
        );
      }

      // Then update new password
      await this.authService.resetPassword(email, password);
    });

    return new ResponseModel(
      HttpStatus.OK,
      getMessage(ERROR_MESSAGE.verifyOTP),
    );
  }
}
