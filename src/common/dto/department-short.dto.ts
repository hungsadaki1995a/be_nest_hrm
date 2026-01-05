import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class DepartmentBaseDto {
  @ApiProperty({
    example: 'GDC',
    description: 'Unique Department code (3–5 chars)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 5)
  code: string;

  @ApiProperty({
    example: 'Global Development Center',
    description: "Department's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Global Development Center Department',
    description: 'Describe about department',
  })
  @ValidateIf((o: DepartmentBaseDto) => o.description !== null)
  @IsString()
  @IsOptional()
  description?: string | null;
}

export class DepartmentShortDto extends DepartmentBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique Department ID',
  })
  id: number;
}
