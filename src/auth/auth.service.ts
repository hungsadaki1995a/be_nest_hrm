import { AppException } from '@/app.exception';
import {
  TOKEN_EXPIRE_DEFAULT,
  REFRESH_TOKEN_EXPIRE_DEFAULT,
} from '@/constants/expired.constant';
import { ERROR_MESSAGE } from '@/constants/message.constant';
import { getMessage } from '@/utils/message.util';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(employeeId: string, password: string) {
    //TODO: Validate request param
    if (!employeeId) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Employee ID']),
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!password) {
      throw new AppException(
        getMessage(ERROR_MESSAGE.required, ['Password']),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const auth = await this.prisma.auth.findUnique({
      where: { employeeId },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!auth || !auth.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, auth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = auth.user.roles.map((r) => r.role.code);

    const payload = {
      sub: auth.user.id,
      employeeId: auth.employeeId,
      roles,
    };

    const tokens = this.generateTokens(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.accessTokenExp,
      user: {
        id: auth.user.id,
        employeeId: auth.employeeId,
        roles,
      },
    };
  }

  findByEmployeeId(employeeId: string) {
    return this.prisma.auth.findUnique({
      where: {
        employeeId,
      },
    });
  }

  async create() {
    const passwordHash = await bcrypt.hash('shinhan@1', 10);

    return this.prisma.user.create({
      data: {
        employeeId: '88888888',
        fullName: 'Pham Van Hao',
        address: 'The Mett, P. An Khanh, TP. HCM',
        email: 'admin@gmail.com',
        gender: 'male',
        phoneNumber: '088888888',
        auth: {
          create: {
            password: passwordHash,
            isActive: true,
            employeeId: '88888888',
          },
        },
      },
    });
  }

  async getProfile(employeeId: string) {
    const employee = await this.prisma.user.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new UnauthorizedException();
    }

    return employee;
  }

  async logout(req: Request) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Missing or invalid Authorization header',
        );
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          new AppException(
            'Missing or invalid Authorization header',
            HttpStatus.UNAUTHORIZED,
          );
        }

        const token = authHeader?.split(' ')[1];
        if (!token) {
          throw new UnauthorizedException('No token provided');
        }

        type LogoutToken = { employeeId?: string };
        const decodeToken = await this.jwtService.verifyAsync<LogoutToken>(
          token,
          {
            secret: this.configService.get<string>(
              'auth.jwt.accessToken.secret',
            ),
          },
        );
        if (!decodeToken?.employeeId) {
          throw new UnauthorizedException('Invalid token');
        }

        await this.deactivateToken(decodeToken.employeeId);

        return {
          message: 'Logout successful',
        };
      } catch (error) {
        console.error('Logout error:', error);
        throw new AppException('Logout failed', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw new AppException('Logout failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(req: Request) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Missing or invalid Authorization header',
        );
      }

      const refreshToken = authHeader.split(' ')[1];
      const secret = this.configService.get<string>(
        'auth.jwt.refreshToken.secret',
      );
      if (!secret) {
        throw new AppException(
          getMessage(ERROR_MESSAGE.missRefreshToken),
          HttpStatus.UNAUTHORIZED,
        );
      }

      const verifiedRaw: unknown = await this.jwtService.verifyAsync(
        refreshToken,
        { secret },
      );
      const verified = verifiedRaw as Record<string, unknown>;

      const employeeId =
        (typeof verified?.employeeId === 'string' && verified.employeeId) ||
        (typeof verified?.sub === 'string' && verified.sub);
      if (!employeeId) {
        throw new AppException(
          getMessage(ERROR_MESSAGE.missEmployeeId),
          HttpStatus.BAD_REQUEST,
        );
      }

      const auth = await this.prisma.auth.findUnique({
        where: { employeeId },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!auth) {
        throw new AppException(
          'Auth record not found or inactive',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const roles =
        (auth.user?.roles || [])
          .map((r) =>
            typeof r?.role?.code === 'string' ? r.role.code : undefined,
          )
          .filter((code) => Boolean(code)) || [];

      const payload = {
        sub: auth.user?.id,
        employeeId: auth.employeeId,
        roles,
      };

      return this.generateTokens(payload);
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new AppException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

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

  async deactivateToken(employeeId: string) {
    return this.prisma.auth.updateMany({
      where: {
        employeeId,
      },
      data: {
        lastLoginAt: null,
        updatedAt: new Date(),
      },
    });
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user) {
      throw new AppException(
        'User or auth record not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the auth record for this user
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
    this.validateNewPassword(newPassword, confirmPassword);

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppException(
        'All password fields (oldPassword, newPassword, confirmPassword) are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (oldPassword === newPassword) {
      throw new AppException(
        'New password must be different from old password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const auth = await this.prisma.auth.findUnique({
      where: { userId },
    });

    if (!auth) {
      throw new AppException('Auth record not found', HttpStatus.BAD_REQUEST);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, auth.password);
    if (!isOldPasswordValid) {
      throw new AppException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
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

  validateNewPassword(password?: string, confirmPassword?: string) {
    if (!password) {
      throw new AppException('Password is required', HttpStatus.BAD_REQUEST);
    }
    if (!confirmPassword) {
      throw new AppException(
        'Confirm password is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (password !== confirmPassword) {
      throw new AppException(
        'Password and confirmPassword do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (password.length < 8) {
      throw new AppException(
        'Password must be at least 8 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
