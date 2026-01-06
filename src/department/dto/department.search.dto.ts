import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from '@/dtos/search-query.dto';

export class DepartmentSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    example: 'GDC',
    description: 'Unique department code',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    example: 'Global Development Center',
    description: "Department's name",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Global Development Center Department',
    description: 'Describe about department',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Search by Head User (name, employee ID, email, phone)',
  })
  @IsString()
  @IsOptional()
  head?: string;

  @ApiPropertyOptional({
    description: 'Search by Team (name, code, description)',
  })
  @IsString()
  @IsOptional()
  team?: string;
}
