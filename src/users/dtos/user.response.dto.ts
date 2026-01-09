import { GenderType } from '@/types/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleDto } from '../dto/user-role.dto';

export class UserResponseDto {
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

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  dateOfBirth: Date;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  onBoardAt: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'male' })
  gender: GenderType;

  @ApiProperty({ type: [UserRoleDto] })
  roles: UserRoleDto[];
}
