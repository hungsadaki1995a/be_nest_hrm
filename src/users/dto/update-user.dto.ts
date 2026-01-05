import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserBasicInfoDto } from './user-basic-info.dto';
import { UserEmployeeInfoDto } from './user-employee-info.dto';

export class UserUpdateEmployeeInfo extends PickType(UserEmployeeInfoDto, [
  'onBoardAt',
  'roleIds',
  'teamId',
] as const) {}

export class UserUpdateDto {
  @ApiProperty({ type: UserBasicInfoDto })
  @IsOptional()
  basicInfo?: UserBasicInfoDto;

  @ApiProperty({ type: UserUpdateEmployeeInfo })
  @IsOptional()
  employeeInfo?: UserUpdateEmployeeInfo;
}
