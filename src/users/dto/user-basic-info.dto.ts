import { GenderType } from '@/types/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserBasicInfoDto {
  @ApiProperty({ example: 'Tran Van A' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '1990-01-01T00:00:00.000Z',
    description: 'ISO-8601 datetime',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({ example: 'male' })
  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @ApiProperty({ example: '888888888888' })
  @IsString()
  @IsNotEmpty()
  identityId: string;

  @ApiProperty({ example: 'The Mett, 15 Tran Bach Dang, TP HCM' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
