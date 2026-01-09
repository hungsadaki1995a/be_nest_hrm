import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '@/dtos/search-query.dto';
import { Transform } from 'class-transformer';
import { transformSortBy } from '@/utils/sort-transformer.util';
import { DepartmentSortFieldEnum } from '../constants/department.sort.constant';
import { DepartmentSearchTypeEnum } from '../constants/department.search.constant';

export class DepartmentSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: DepartmentSortFieldEnum,
    enumName: 'DepartmentSortFieldEnum',
    default: DepartmentSortFieldEnum.CREATED_AT,
  })
  @Transform(transformSortBy(DepartmentSortFieldEnum))
  @IsEnum(DepartmentSortFieldEnum)
  @IsOptional()
  sortBy?: DepartmentSortFieldEnum = DepartmentSortFieldEnum.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: DepartmentSearchTypeEnum,
    enumName: 'DepartmentSearchTypeEnum',
    default: DepartmentSearchTypeEnum.ALL,
  })
  @IsEnum(DepartmentSearchTypeEnum)
  @IsOptional()
  type?: DepartmentSearchTypeEnum = DepartmentSearchTypeEnum.ALL;
}
