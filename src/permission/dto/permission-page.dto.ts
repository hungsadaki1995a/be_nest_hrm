import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PermissionPageDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  canCreate: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  canRead: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  canUpdate: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  canDelete: boolean;
}
