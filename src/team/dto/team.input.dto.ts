import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class TeamCreateDto {
  @ApiProperty({ example: 'FE', description: 'Unique team code (2–5 chars)' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  code: string;

  @ApiProperty({ example: 'Frontend' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'GDC Frontend Team', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Department ID this team belongs to',
  })
  @IsInt()
  departmentId: number;

  @ApiProperty({
    example: 10,
    required: false,
    nullable: true,
    description: 'User ID of team leader',
  })
  @IsInt()
  @IsOptional()
  leaderId?: number | null;

  @ApiProperty({
    example: [10, 11, 12],
    required: false,
    description: 'User IDs of team members',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  memberIds?: number[];
}

export class TeamUpdateDto {
  @ApiProperty({ example: 'Frontend' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'GDC Frontend Team', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Change department',
  })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({
    example: 15,
    nullable: true,
    description: 'Change / remove team leader',
  })
  @IsInt()
  @IsOptional()
  leaderId?: number | null;

  @ApiPropertyOptional({
    example: [10, 11, 12],
    description: 'Replace team members',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  memberIds?: number[];
}
