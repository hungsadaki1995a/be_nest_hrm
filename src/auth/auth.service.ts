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
import {
  AUTH_PROFILE_SELECT,
  AUTH_SELECT,
} from './constants/auth.select.constant';
import { Prisma } from '@prisma/client';
import { hashPassword } from '@/utils/password.util';
import {
  throwIfFalse,
  throwIfMissing,
  throwIfTrue,
} from '@/utils/validate.util';
import { handlePrismaError } from '@/prisma/prisma-error.handler';
import { RoleShortDto } from '@/dtos/role-short.dto';

type TToken = { employeeId?: string; sub?: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateTokens(
    userId: number,
    employeeId: string,
    roles: RoleShortDto[],
  ) {
    const payload = { userId, employeeId, roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
      expiresIn: TOKEN_EXPIRE_DEFAULT,
    });

    const refreshToken = this.jwtService.sign(payload, {
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

  validateConfirmPassword(password?: string, confirmPassword?: string) {
    throwIfMissing(password, { field: 'Password' });
    throwIfMissing(confirmPassword, { field: 'Confirm Password' });

    if (confirmPassword && password !== confirmPassword) {
      throw new AppException(getMessage(AUTH_ERROR_MESSAGE.passwordDoNotMatch));
    }
  }

  private async getUser(employeeId: string) {
    const user = await this.prisma.user.findUnique({
      where: { employeeId },
      select: SELECT_USER_PROPERTIES,
    });

    throwIfMissing(user, { message: getMessage(AUTH_ERROR_MESSAGE.inactive) });

    return user;
  }

  private async getAuth(userId: number) {
    const auth = await this.prisma.auth.findUnique({
      where: { userId, status: 'ACTIVE' },
      select: AUTH_SELECT,
    });

    throwIfMissing(auth, { message: getMessage(AUTH_ERROR_MESSAGE.inactive) });

    const roles = auth.user.roles.map((r) => r.role);

    return { auth, roles };
  }

  private async getEmployeeIdFromReq(req: Request) {
    const authHeader = req.headers.authorization;

    throwIfMissing(authHeader, {
      message: getMessage(AUTH_ERROR_MESSAGE.missingHeader),
    });

    throwIfFalse(authHeader?.startsWith('Bearer '), {
      message: getMessage(AUTH_ERROR_MESSAGE.missingHeader),
    });

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>(
      'auth.jwt.refreshToken.secret',
    );

    throwIfMissing(secret, {
      message: getMessage(AUTH_ERROR_MESSAGE.missingToken),
      status: HttpStatus.UNAUTHORIZED,
    });

    let decodedToken: TToken;

    try {
      decodedToken = await this.jwtService.verifyAsync<TToken>(token, {
        secret,
      });
    } catch (err) {
      console.log('Error decode token', err);
      throw new AppException(
        getMessage(AUTH_ERROR_MESSAGE.missingToken),
        HttpStatus.UNAUTHORIZED,
      );
    }

    throwIfMissing(decodedToken, {
      message: AUTH_ERROR_MESSAGE.missingToken,
      status: HttpStatus.UNAUTHORIZED,
    });

    throwIfMissing(decodedToken.employeeId, {
      message: AUTH_ERROR_MESSAGE.missingToken,
      status: HttpStatus.UNAUTHORIZED,
    });

    return decodedToken.employeeId;
  }

  async create(
    userId: number,
    password: string,
    tx?: Prisma.TransactionClient,
  ) {
    throwIfMissing(password, { field: 'Password' });

    const passwordHash = await hashPassword(password);
    const client = tx ?? this.prisma;

    try {
      return client.auth.create({
        data: {
          userId,
          password: passwordHash,
        },
      });
    } catch (e) {
      handlePrismaError(e, { module: 'Auth', entity: 'User' });
    }
  }

  async login(employeeId: string, password: string) {
    throwIfMissing(employeeId, { field: 'Employee ID' });
    throwIfMissing(password, { field: 'Password' });

    const user = await this.getUser(employeeId);
    const { auth, roles } = await this.getAuth(user.id);

    throwIfFalse(await bcrypt.compare(password, auth.password), {
      message: getMessage(AUTH_ERROR_MESSAGE.incorrect),
    });

    const tokens = this.generateTokens(auth.user.id, user.employeeId, roles);

    return {
      ...tokens,
      user,
      roles,
    };
  }

  findByEmployeeId(employeeId: string) {
    throwIfMissing(employeeId, {
      field: 'Employee ID',
      status: HttpStatus.NOT_FOUND,
    });

    const user = this.prisma.user.findUnique({
      where: {
        employeeId,
      },
    });

    throwIfMissing(user, {
      message: getMessage(ERROR_MESSAGE.notFound, ['User']),
      status: HttpStatus.NOT_FOUND,
    });

    return user;
  }

  async getProfile(employeeId: string) {
    throwIfMissing(employeeId, {
      field: 'Employee ID',
      status: HttpStatus.NOT_FOUND,
    });

    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
      select: AUTH_PROFILE_SELECT,
    });

    throwIfMissing(employee, {
      message: getMessage(ERROR_MESSAGE.notFound, ['User']),
      status: HttpStatus.NOT_FOUND,
    });

    return employee;
  }

  async refreshToken(req: Request) {
    const employeeId = await this.getEmployeeIdFromReq(req);

    const user = await this.getUser(employeeId);
    const { auth, roles } = await this.getAuth(user.id);

    const tokens = this.generateTokens(auth.user.id, user.employeeId, roles);

    return {
      ...tokens,
      user,
      roles,
    };
  }

  async resetPassword(email: string, newPassword: string) {
    throwIfMissing(newPassword, { field: 'Password' });

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    throwIfMissing(user, { message: getMessage(AUTH_ERROR_MESSAGE.incorrect) });

    const passwordHash = await hashPassword(newPassword);
    try {
      return await this.prisma.auth.update({
        where: { userId: user.id },
        data: {
          password: passwordHash,
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      handlePrismaError(e, { module: 'Auth', entity: 'User' });
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    this.validateConfirmPassword(newPassword, confirmPassword);
    throwIfMissing(oldPassword, { field: 'Current Password' });
    throwIfTrue(oldPassword === newPassword, {
      message: getMessage(AUTH_ERROR_MESSAGE.passwordMatch, [
        'New Password',
        'Current Password',
      ]),
    });

    const { auth } = await this.getAuth(userId);

    throwIfFalse(await bcrypt.compare(oldPassword, auth.password), {
      message: getMessage(AUTH_ERROR_MESSAGE.incorrect),
    });

    const passwordHash = await hashPassword(newPassword);

    try {
      return await this.prisma.auth.update({
        where: { userId },
        data: {
          password: passwordHash,
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      handlePrismaError(e, { module: 'Auth', entity: 'User' });
    }
  }
}
