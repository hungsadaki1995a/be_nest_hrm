import { GenderType } from '@/types/auth.type';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleDto } from './user-role.dto';

export class UserBasicInfoDto {
  @ApiProperty({ example: 'Tran Van A' })
  fullName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  phoneNumber: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  dateOfBirth?: Date;

  @ApiProperty({ example: 'male' })
  gender: GenderType;

  @ApiProperty({ example: 'The Mett, 15 Tran Bach Dang, TP HCM' })
  address: string;

  @ApiProperty({ example: '' })
  avatarUrl?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UserEmployeeInfoDto {
  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  onBoardAt: Date;

  @ApiProperty({ type: [UserRoleDto] })
  roles: UserRoleDto[];

  @ApiProperty({ example: '23053631' })
  employeeId: string;

  //TODO: Add department field
}

export class UserDetailDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ type: UserBasicInfoDto })
  basicInfo: UserBasicInfoDto;

  @ApiProperty({ type: UserEmployeeInfoDto })
  employeeInfo: UserEmployeeInfoDto;
}
