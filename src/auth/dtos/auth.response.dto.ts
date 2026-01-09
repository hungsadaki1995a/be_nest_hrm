import { RoleShortDto } from '@/dtos/role-short.dto';
import { UserShortDto } from '@/dtos/user-short.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token' })
  refreshToken: string;

  @ApiProperty({ description: 'Expire' })
  expiresIn: number;

  @Type(() => UserShortDto)
  @ApiProperty({ type: () => UserShortDto })
  user: UserShortDto;

  @ApiProperty({ type: () => [RoleShortDto] })
  @ValidateNested({ each: true })
  @Type(() => RoleShortDto)
  roles: RoleShortDto[];
}
