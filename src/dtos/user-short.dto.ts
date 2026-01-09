import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserBaseDto {
  @ApiProperty({
    example: '26013001',
    description: 'Unique Employee ID (8 digits)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8)
  employeeId: string;

  @ApiProperty({
    example: 'Tran Van A',
    description: "User's full name",
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: "User's personal email",
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0901234567',
    description: "User's personal phone number",
  })
  @IsString()
  @IsNotEmpty()
  @Length(10)
  phoneNumber: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'http://abc.com/avatar.png',
    description: "User's avatar URL",
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string | null;
}

export class UserShortDto extends UserBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique User ID',
  })
  id: number;
}
