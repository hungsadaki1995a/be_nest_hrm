import { UserBaseDto } from '@/dtos/user-short.dto';
import { GenderType } from '@/types/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto extends UserBaseDto {
  @ApiProperty({ example: 'male' })
  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @ApiProperty({ example: '88888888' })
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
