import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  @ApiProperty({ example: 'DEV' })
  code: string;

  @ApiProperty({ example: 'Developer' })
  name: string;
}
