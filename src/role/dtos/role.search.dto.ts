import { SearchQueryDto } from '@/dtos/search-query.dto';
import { transformSortBy } from '@/utils/sort-transformer.util';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleSearchType } from '../constants/role.search.constant';
import { RoleSortField } from '../constants/role.sort.constant';

export class RoleSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: RoleSortField,
    default: RoleSortField.CREATED_AT,
  })
  @Transform(transformSortBy(RoleSortField))
  @IsEnum(RoleSortField)
  @IsOptional()
  sortBy?: RoleSortField = RoleSortField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: RoleSearchType,
    default: RoleSearchType.ALL,
  })
  @IsEnum(RoleSearchType)
  @IsOptional()
  type?: RoleSearchType = RoleSearchType.ALL;
}
