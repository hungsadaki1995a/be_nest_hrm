import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { UserRoleDto } from './user-role.dto';

export class UserEmployeeInfoDto {
  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  onBoardAt: Date;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roleIds: number[];

  @ApiProperty({ type: [UserRoleDto] })
  roles: UserRoleDto[];

  @ApiProperty({ example: '23053631' })
  employeeId: string;

  @ApiProperty({ example: 1 })
  teamId: string;

  //TODO: Add department field
}
