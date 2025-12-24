import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(employeeId: string, password: string) {
    //TODO: Validate request param
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

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: 3600,
      }),
      expiresIn: 3600,
      user: {
        id: auth.user.id,
        employeeId: auth.employeeId,
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
}
