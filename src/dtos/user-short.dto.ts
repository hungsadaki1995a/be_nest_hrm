import { VALIDATION_MESSAGE } from '@/constants/message.constant';
import { getMessage } from '@/utils/message.util';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserBaseDto {
  @ApiProperty({
    example: '26013001',
    description: 'Unique Employee ID (8 digits)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 8, {
    message: getMessage(VALIDATION_MESSAGE.exactlyChar, ['Employee ID', '8']),
  })
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
  @Length(10, 10, {
    message: getMessage(VALIDATION_MESSAGE.exactlyChar, ['Phone Number', '10']),
  })
  phoneNumber: string;
}

export class UserShortDto extends UserBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique User ID',
  })
  id: number;
}
