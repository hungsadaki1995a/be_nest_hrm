import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '23053239' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'shinhan@1' })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
