import { ApiProperty } from '@nestjs/swagger';
import { UserShortDto } from '@/dtos/user-short.dto';
import { UserStatusEnum } from '@/types/auth.type';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleShortDto } from '@/dtos/role-short.dto';

export class UserResponseDto extends UserShortDto {
  @ApiProperty({
    example: 'WORKING',
    enum: UserStatusEnum,
    enumName: 'UserStatusEnum',
  })
  @IsEnum(UserStatusEnum)
  @IsNotEmpty()
  status: UserStatusEnum;

  @ApiProperty({ type: [RoleShortDto] })
  @ValidateNested({ each: true })
  @Type(() => RoleShortDto)
  roles: RoleShortDto[];

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-02T15:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
