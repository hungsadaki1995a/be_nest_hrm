import { AppException } from '@/app.exception';
import {
  TOKEN_EXPIRE_DEFAULT,
  REFRESH_TOKEN_EXPIRE_DEFAULT,
} from '@/constants/expired.constant';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUTH_ERROR_MESSAGE } from './constants/auth.error.constant';
import { SELECT_USER_PROPERTIES } from '@/constants/select.constant';
import { AUTH_SELECT } from './constants/auth.select.constant';
import { LoginResponseDto } from './dtos/auth.response.dto';
import { Prisma } from '@prisma/client';

type TToken = { employeeId?: string; sub?: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateTokens(payload: Record<string, any>) {
    const accessToken = this.jwtService.sign(payload as object, {
      secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
      expiresIn: TOKEN_EXPIRE_DEFAULT,
    });

    const refreshToken = this.jwtService.sign(payload as object, {
      secret: this.configService.get<string>('auth.jwt.refreshToken.secret'),
      expiresIn: REFRESH_TOKEN_EXPIRE_DEFAULT,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExp: TOKEN_EXPIRE_DEFAULT,
      refreshTokenExp: REFRESH_TOKEN_EXPIRE_DEFAULT,
    };
  }

  private validateEmployeeId(employeeId?: string) {
    if (!employeeId) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Employee ID']),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async convertEmployeeIdToUser(employeeId?: string) {
    this.validateEmployeeId(employeeId);

    const user = await this.prisma.user.findUnique({
      where: { employeeId },
      select: SELECT_USER_PROPERTIES,
    });

    if (!user) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.incorrect));
    }

    return user;
  }

  private async validateAuth(userId: number) {
    const auth = await this.prisma.auth.findUnique({
      where: { userId },
      select: AUTH_SELECT,
    });

    if (!auth || auth.status !== 'ACTIVE') {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.inactive));
    }

    return auth;
  }

  private validateHeader(req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingHeader),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return authHeader;
  }

  private validateToken(token?: string) {
    if (!token) {
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingToken),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return token;
  }

  private async decodeToken(token: string, secret?: string) {
    if (!secret) {
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingToken),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decodedToken = await this.jwtService.verifyAsync<TToken>(token, {
      secret,
    });

    if (!decodedToken || !decodedToken.employeeId) {
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingToken),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return decodedToken;
  }

  validatePassword(password?: string) {
    if (!password) {
      throw new AppException(getMessage(ERROR_MESSAGE.required, ['Password']));
    }
  }

  validateConfirmPassword(password?: string, confirmPassword?: string) {
    this.validatePassword(password);
    this.validatePassword(confirmPassword);

    if (confirmPassword && password !== confirmPassword) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.passwordDoNotMatch));
    }
  }

  async create(
    userId: number,
    password: string,
    tx?: Prisma.TransactionClient,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);

    const client = tx ?? this.prisma;

    return client.auth.create({
      data: {
        userId,
        password: passwordHash,
      },
    });
  }

  async login(employeeId: string, password: string): Promise<LoginResponseDto> {
    console.log('employeeId', employeeId);
    console.log('password', password);

    this.validateEmployeeId(employeeId);
    this.validatePassword(password);

    const user = await this.convertEmployeeIdToUser(employeeId);
    const auth = await this.validateAuth(user.id);
    const isPasswordValid = await bcrypt.compare(password, auth.password);

    if (!isPasswordValid) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.incorrect));
    }

    const roles = auth.user.roles.map((r) => r.role);

    const payload = {
      sub: auth.user.id,
      employeeId: user.employeeId,
      roles,
    };

    const tokens = this.generateTokens(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.accessTokenExp,
      user,
      roles,
    };
  }

  findByEmployeeId(employeeId: string) {
    this.validateEmployeeId(employeeId);

    return this.prisma.user.findUnique({
      where: {
        employeeId,
      },
    });
  }

  async getProfile(employeeId: string) {
    this.validateEmployeeId(employeeId);

    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.inactive));
    }

    return employee;
  }

  async logout(req: Request) {
    try {
      const authHeader = this.validateHeader(req);
      const token = this.validateToken(authHeader.split(' ')[1]);
      const secret = this.configService.get<string>(
        'auth.jwt.accessToken.secret',
      );
      const decodedToken = await this.decodeToken(token, secret);

      await this.deactivateToken(decodedToken.employeeId);

      return {
        message: AUTH_ERROR_MESSAGE.logoutSuccess,
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.logoutFailed),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refreshToken(req: Request) {
    try {
      const authHeader = this.validateHeader(req);
      const token = authHeader.split(' ')[1];
      const secret = this.configService.get<string>(
        'auth.jwt.refreshToken.secret',
      );

      const decodedToken = await this.decodeToken(token, secret);
      const user = await this.convertEmployeeIdToUser(decodedToken.employeeId);
      const auth = await this.validateAuth(user.id);

      const roles =
        (auth.user?.roles || [])
          .map((r) =>
            typeof r?.role?.code === 'string' ? r.role.code : undefined,
          )
          .filter((code) => Boolean(code)) || [];

      const payload = {
        sub: auth.user?.id,
        employeeId: user.employeeId,
        roles,
      };

      return this.generateTokens(payload);
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingToken),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async deactivateToken(employeeId?: string) {
    const user = await this.convertEmployeeIdToUser(employeeId);

    return this.prisma.auth.update({
      where: {
        userId: user.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async resetPassword(email: string, newPassword: string) {
    this.validatePassword(newPassword);

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.incorrect));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.auth.update({
      where: { userId: user.id },
      data: {
        password: passwordHash,
        updatedAt: new Date(),
      },
    });

    return true;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    this.validateConfirmPassword(newPassword, confirmPassword);

    if (!oldPassword) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Current Password']),
      );
    }

    if (oldPassword === newPassword) {
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.passwordMatch, [
          'New Password',
          'Current Password',
        ]),
      );
    }

    const auth = await this.prisma.auth.findUnique({
      where: { userId },
    });

    if (!auth) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.inactive));
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, auth.password);

    if (!isOldPasswordValid) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.incorrect));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.auth.update({
      where: { userId },
      data: {
        password: passwordHash,
        updatedAt: new Date(),
      },
    });

    return true;
  }
}
