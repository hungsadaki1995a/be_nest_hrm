import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class DepartmentDto {
  @ApiProperty({ example: 'GDC' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 5)
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  @IsString()
  @IsNotEmpty()
  name: string;

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

class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class TeamResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
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

  @ApiProperty({ type: UserResponseDto, nullable: true })
  head?: UserResponseDto | null;

  @ApiProperty({ type: [TeamResponseDto] })
  teams: TeamResponseDto[];

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
