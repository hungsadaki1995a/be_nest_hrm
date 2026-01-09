import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class User {
  @ApiProperty({ description: "User's ID" })
  id: number;

  @ApiProperty({ description: "User's Employee ID" })
  employeeId: string;

  @ApiProperty({ description: "User's Roles" })
  role: string[];
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token' })
  refreshToken: string;

  @ApiProperty({ description: 'Expire' })
  expiresIn: number;

  @Type(() => User)
  @ApiProperty({ type: () => User })
  user: User;
}
