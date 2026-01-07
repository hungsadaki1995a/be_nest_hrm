import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '@/dtos/search-query.dto';
import { Transform } from 'class-transformer';
import { transformSortBy } from '@/utils/sort-transformer.util';
import { DepartmentSortField } from '../constants/department.sort.constant';
import { DepartmentSearchType } from '../constants/department.search.constant';

export class DepartmentSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: DepartmentSortField,
    default: DepartmentSortField.CREATED_AT,
  })
  @Transform(transformSortBy(DepartmentSortField))
  @IsEnum(DepartmentSortField)
  @IsOptional()
  sortBy?: DepartmentSortField = DepartmentSortField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: DepartmentSearchType,
    default: DepartmentSearchType.ALL,
  })
  @IsEnum(DepartmentSearchType)
  @IsOptional()
  type?: DepartmentSearchType = DepartmentSearchType.ALL;
}
