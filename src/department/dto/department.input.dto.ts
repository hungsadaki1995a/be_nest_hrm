import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class DepartmentCreateDto {
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
