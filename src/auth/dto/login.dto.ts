import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '88888888' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'shinhan@1' })
  @IsString()
  @MinLength(6)
  password: string;
}
