import { AppException } from '@/app.exception';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { otpEmailTemplate } from '@/templates/email.templates';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpLength = 6;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private generateOtp(len = this.otpLength) {
    const min = 10 ** (len - 1);
    const max = 10 ** len - 1;
    return String(randomInt(min, max + 1));
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

  async sendOtp(body: SendOtpDto) {
    const { email, fullName } = body;
    if (!email) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Email']),
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.otp.updateMany({
      where: { email, isActive: true, purpose: 'RESET_PASSWORD' },
      data: {
        expiresAt: new Date(0),
        revokedAt: new Date(),
        isActive: false,
      },
    });
    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    const ttlMinutes = Number(
      this.config.get<number>('mailer.otp.ttlMinutes', 10),
    );
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // store OTP
    await this.prisma.otp.create({
      data: {
        email,
        otpHash,
        expiresAt,
        usedAt: null,
        isActive: true,
        purpose: 'RESET_PASSWORD',
      },
    });

    // send email
    try {
      // email template
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
      return new AppException(
        getMessage(ERROR_MESSAGE.otpSentSuccess),
        HttpStatus.OK,
      );
    } catch (err: unknown) {
      this.logger.error('Failed to send OTP email', err as any);
      throw err;
    }
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this.prisma.otp.findFirst({
      where: { email, isActive: true, usedAt: null },
    });
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

    if (record.attempts >= 5) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.otpTooManyAttempts),
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = this.hashOtp(otp);
    if (hash !== record.otpHash) {
      await this.prisma.otp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new AppException(
        getMessage(ERROR_MESSAGE.otpInvalid),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.otp.update({
      where: { id: record.id },
      data: {
        isActive: false,
        usedAt: new Date(),
      },
    });
    return new AppException(getMessage(ERROR_MESSAGE.otpValid), HttpStatus.OK);
  }
}
