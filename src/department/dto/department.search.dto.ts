import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from '@/common/dto/search-query.dto';

export class DepartmentSearchDto extends SearchQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Search by head user (name, employee ID, email, phone)',
  })
  @IsString()
  @IsOptional()
  head?: string;

  @ApiPropertyOptional({
    description: 'Search by team (name, code, description)',
  })
  @IsString()
  @IsOptional()
  team?: string;
}
