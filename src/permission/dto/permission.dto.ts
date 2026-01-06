import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber, IsObject } from 'class-validator';
import { PermissionPageCodeEnum } from '../enum/permission.enum';
import { PermissionPageDto } from './permission-page.dto';

export class PermissionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    example: {
      DASHBOARD: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
      USER: {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      },
    },
  })
  @IsObject()
  @Allow()
  permissions: Partial<Record<PermissionPageCodeEnum, PermissionPageDto>>;
}
