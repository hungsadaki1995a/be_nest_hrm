import { AppException } from '@/app.exception';
import { ERROR_MESSAGE } from '@/constants/message.constant';
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
      },
    });

    // send email
    try {
      const transporter = this.createTransporter();
      await transporter.sendMail({
        from: `"No-Reply" <${this.config.get<string>('mailer.smtp.user')}>`,
        to: email,
        subject: 'Your OTP code',
        html: `
        <div style="
          max-width: 520px;
          margin: 0 auto;
          font-family: Arial, Helvetica, sans-serif;
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        ">
          <!-- Header -->
          <div style="
            background-color: #0747A6;
            padding:10px 20px;
            text-align: center;
            display: flex !important;
            background-color: #0747A6;
            padding: 10px 20px;
            align-items: center;
          ">
            <img
              src="https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-1/375283710_122121616994012874_2270389940254831183_n.jpg?stp=c0.13.915.915a_dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=c60HJB2L8RwQ7kNvwGKGfZl&_nc_oc=AdlgIL_v3Mysfhy8Lxb2k1C12Da1MOz9bZcDidtngPEeBdGiubnNTMtdH5xlSP14Dtg&_nc_zt=24&_nc_ht=scontent.fhan4-1.fna&_nc_gid=3NdYPJq4ndCbSjBOk6xg8g&oh=00_Afq6ux_mTVLUU_y2AsxQCz9LX_9XCkNID6RJuGB3TsSYaA&oe=69626B81"
              alt="Shinhan DS Logo"
              style="height: 40px; margin:auto 0px; border-radius:100%;"
            />
            <h2 style="
              color: #ffffff;
              font-size: 18px;
              font-weight: 600;
              margin-left: 10px;
            ">
              Shinhan DS
            </h2>
          </div>
        
          <!-- Body -->
          <div style="padding: 24px; color: #111827;">
            <p style="margin: 0 0 12px;">
              Hello <b>${fullName || email}</b>,
            </p>
        
            <p style="margin: 0 0 16px;">
              We received a request to verify your account. Please use the OTP code below to complete your verification:
            </p>
        
            <!-- OTP -->
            <div style="
              background-color: #f0f6ff;
              border: 1px dashed #0747A6;
              border-radius: 6px;
              padding: 16px;
              text-align: center;
              margin: 20px 0;
            ">
              <span style="
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 4px;
                color: #0747A6;
              ">
                ${otp}
              </span>
            </div>
        
            <p style="
              margin: 0 0 8px;
              font-size: 14px;
            ">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>
            
            <p style="
              margin: 0 0 8px;
              font-size: 14px;
            ">
              <strong>Important:</strong> Do not share this code with anyone. Our team will never ask for your OTP.
            </p>
        
            <p style="
              margin: 0;
              font-size: 13px;
              color: #6b7280;
            ">
              If you did not request this code, please ignore this email or contact our support team immediately.
            </p>
          </div>
        
          <!-- Footer -->
          <div style="
            padding: 14px 24px;
            background-color: #f9fafb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          ">
            © ${new Date().getFullYear()} Shinhan DS. All rights reserved.
          </div>
        
        </div>
      `,
      });
      throw new AppException(
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
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.otpNotFound),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (new Date() > record.expiresAt) {
      await this.prisma.otp.delete({ where: { id: record.id } });
      throw new AppException(
        getMessage(ERROR_MESSAGE.otpExpired),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (record.attempts >= 5) {
      await this.prisma.otp.delete({ where: { id: record.id } });
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

    await this.prisma.otp.delete({ where: { id: record.id } });
    throw new AppException(getMessage(ERROR_MESSAGE.otpValid), HttpStatus.OK);
  }
}
