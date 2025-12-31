import { TeamShortResponseDto } from '@/team/team.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class TemporaryUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class DepartmentDto {
  @ApiProperty({
    example: 'GDC',
    description: 'Unique department code (3–5 chars)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 5)
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Global Development Center department',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 3,
    required: false,
    description: 'User ID of department head',
  })
  @IsInt()
  @IsOptional()
  headId?: number;
}

export class DepartmentUpdateDto {
  @ApiProperty({ example: 'Global Development Center' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Global Development Center department' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 3,
    required: false,
    description: 'User ID of department head',
  })
  @IsInt()
  @IsOptional()
  headId?: number;
}

export class DepartmentResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'GDC' })
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  name: string;

  @ApiProperty({ example: 'Global Development Center department' })
  description?: string;

  @ApiProperty({ type: TemporaryUserResponseDto, nullable: true })
  head?: TemporaryUserResponseDto | null;

  @ApiProperty({ type: () => [TeamShortResponseDto] })
  teams: TeamShortResponseDto[];

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-02T15:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class DepartmentShortResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'GDC' })
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  name: string;

  @ApiProperty({ example: 'Global Development Center department' })
  description?: string;

  @ApiProperty({ type: TemporaryUserResponseDto, nullable: true })
  head?: TemporaryUserResponseDto | null;

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-02T15:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
