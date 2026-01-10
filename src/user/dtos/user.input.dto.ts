import { UserBaseDto } from '@/dtos/user-short.dto';
import { GenderEnum } from '@/types/auth.type';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto extends UserBaseDto {
  @ApiProperty({
    example: 'MALE',
    enum: GenderEnum,
    enumName: 'GenderEnum',
  })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @ApiProperty({ example: [1] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roleIds: number[];
}

export class UserUpdateDto extends PartialType(
  OmitType(UserCreateDto, ['employeeId'] as const),
) {}

export class UserCreateProfileDto {
  @ApiProperty({
    example: 'MALE',
    enum: GenderEnum,
    enumName: 'GenderEnum',
  })
  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender?: GenderEnum;

  @ApiPropertyOptional({
    nullable: true,
    example: 'http://abc.com/avatar.png',
    description: "User's avatar URL",
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string | null;
}
