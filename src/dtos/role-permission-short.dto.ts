import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class RolePermissionBaseDto {
  @ApiProperty({
    example: 'USER',
    description: 'Page or resource code',
  })
  @IsString()
  @IsNotEmpty()
  page: string;

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
