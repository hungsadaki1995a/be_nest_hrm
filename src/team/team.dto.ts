import {
  DepartmentShortResponseDto,
  TemporaryUserResponseDto,
} from '@/department/department.dto';
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

export class TeamDto {
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

export class TeamResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'FE' })
  code: string;

  @ApiProperty({ example: 'Frontend' })
  name: string;

  @ApiProperty({ example: 'GDC Frontend Team', nullable: true })
  description?: string | null;

  @ApiProperty({ type: () => DepartmentShortResponseDto })
  department: DepartmentShortResponseDto;

  @ApiProperty({ type: TemporaryUserResponseDto, nullable: true })
  leader?: TemporaryUserResponseDto | null;

  @ApiProperty({ type: [TemporaryUserResponseDto] })
  members: TemporaryUserResponseDto[];

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

export class TeamShortResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'FE' })
  code: string;

  @ApiProperty({ example: 'Frontend' })
  name: string;

  @ApiProperty({ example: 'GDC Frontend Team', nullable: true })
  description?: string | null;

  @ApiProperty({ type: TemporaryUserResponseDto, nullable: true })
  leader?: TemporaryUserResponseDto | null;

  @ApiProperty({ type: [TemporaryUserResponseDto] })
  members: TemporaryUserResponseDto[];

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
