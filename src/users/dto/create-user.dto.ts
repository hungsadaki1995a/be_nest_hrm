import { GenderType } from '@/types/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ example: 'Tran Van A' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '888888888888' })
  @IsString()
  @IsNotEmpty()
  identityId: string;

  @ApiProperty({ example: 'The Mett, P. An Khanh, TP. HCM' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-01-01T00:00:00.000Z',
    description: 'ISO-8601 datetime',
  })
  @IsDateString()
  @IsOptional()
  onBoardAt?: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '1990-01-01T00:00:00.000Z',
    description: 'ISO-8601 datetime',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  teamId?: number;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roleIds: number[];
}
