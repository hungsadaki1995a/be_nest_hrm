import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateRolePermissionDto } from '@/dtos/role-permission-short.dto';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    type: [UpdateRolePermissionDto],
    description: 'Partial permissions to update - only specified fields will be changed',
    example: [
      {
        page: 'USER',
        canDelete: true, 
      },
      {
        page: 'ROLE',
        canCreate: false,
        canUpdate: false, 
      },
    ],
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateRolePermissionDto)
  permissions: UpdateRolePermissionDto[];
}
