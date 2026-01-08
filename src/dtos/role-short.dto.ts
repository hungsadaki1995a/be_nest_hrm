import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class RoleBaseDto {
  @ApiProperty({
    example: 'HR_MANAGER',
    description: 'Unique role code (UPPERCASE, underscore only)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z_]+$/, {
    message: 'Role code must be uppercase and underscore only',
  })
  code: string;

  @ApiProperty({
    example: 'HR Manager',
    description: 'Human-readable role name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Manage employees and departments',
    description: 'Describe about Role',
  })
  @ValidateIf((o: RoleBaseDto) => o.description !== null)
  @IsString()
  @IsOptional()
  description?: string | null;
}

export class RoleShortDto extends RoleBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique Role ID',
  })
  id: number;
}
