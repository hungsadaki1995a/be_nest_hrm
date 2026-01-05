import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserBasicInfoDto } from './user-basic-info.dto';
import { UserEmployeeInfoDto } from './user-employee-info.dto';

export class UserDetailEmployeeInfo extends PickType(UserEmployeeInfoDto, [
  'employeeId',
  'onBoardAt',
  'roles',
] as const) {}

export class UserDetailDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ type: UserBasicInfoDto })
  basicInfo: UserBasicInfoDto;

  @ApiProperty({ type: UserDetailEmployeeInfo })
  employeeInfo: UserDetailEmployeeInfo;
}
