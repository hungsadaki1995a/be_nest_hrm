import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Page } from '@prisma/client';

export class RolePermissionBaseDto {
  @ApiProperty({
    enum: Page,
    example: Page.USER,
    description: 'Page or resource code',
  })
  @IsEnum(Page)
  page: Page;

  @ApiProperty({ example: true })
  @IsBoolean()
  canCreate: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  canRead: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  canUpdate: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  canDelete: boolean;
}

//  DTO cho update permissions 
export class UpdateRolePermissionDto {
  @ApiProperty({
    enum: Page,
    example: Page.USER,
  })
  @IsEnum(Page)
  page: Page;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsOptional()
  canCreate?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsOptional()
  canRead?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsBoolean()
  @IsOptional()
  canUpdate?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsBoolean()
  @IsOptional()
  canDelete?: boolean;
}

// DTO cho update permissions
export class BulkUpdatePermissionsDto {
  @ApiProperty({
    type: [UpdateRolePermissionDto],
    description: 'Array of permissions to update',
  })
  permissions: UpdateRolePermissionDto[];
}