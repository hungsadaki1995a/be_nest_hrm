import { AppException } from '@/app.exception';
import {
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_REFRESH_TOKEN_EXPIRE,
} from '@/common/constants/expired';
import { ErrorMessage } from '@/consts/message.const';
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
        getMessage(ErrorMessage.required, ['Employee ID']),
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!password) {
      throw new AppException(
        getMessage(ErrorMessage.required, ['Password']),
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

      type LogoutToken = { employeeId?: string };
      const decodeToken = await this.jwtService.verifyAsync<LogoutToken>(
        token,
        {
          secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
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
          getMessage(ErrorMessage.missRefreshToken),
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
          getMessage(ErrorMessage.missEmployeeId),
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
      expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = this.jwtService.sign(payload as object, {
      secret: this.configService.get<string>('auth.jwt.refreshToken.secret'),
      expiresIn: JWT_REFRESH_TOKEN_EXPIRE,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExp: JWT_ACCESS_TOKEN_EXPIRE,
      refreshTokenExp: JWT_REFRESH_TOKEN_EXPIRE,
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
}
