import { ApiProperty } from '@nestjs/swagger';

export class UserShortDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: '23053631' })
  employeeId: string;

  @ApiProperty({ example: 'Tran Van A' })
  fullName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  phoneNumber: string;

  @ApiProperty({ example: '' })
  avatarUrl?: string;
}
