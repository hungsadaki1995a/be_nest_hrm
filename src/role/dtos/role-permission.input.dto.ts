import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RolePermissionBaseDto } from '@/dtos/role-permission-short.dto';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    type: [RolePermissionBaseDto],
    description: 'Full snapshot of role permissions',
    example: [
      {
        page: 'USER',
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: false,
      },
      {
        page: 'ROLE',
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
      },
    ],
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionBaseDto)
  permissions: RolePermissionBaseDto[];
}
