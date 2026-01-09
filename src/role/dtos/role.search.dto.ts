import { SearchQueryDto } from '@/dtos/search-query.dto';
import { transformSortBy } from '@/utils/sort-transformer.util';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleSearchTypeEnum } from '../constants/role.search.constant';
import { RoleSortFieldEnum } from '../constants/role.sort.constant';

export class RoleSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: RoleSortFieldEnum,
    enumName: 'RoleSortFieldEnum',
    default: RoleSortFieldEnum.CREATED_AT,
  })
  @Transform(transformSortBy(RoleSortFieldEnum))
  @IsEnum(RoleSortFieldEnum)
  @IsOptional()
  sortBy?: RoleSortFieldEnum = RoleSortFieldEnum.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: RoleSearchTypeEnum,
    enumName: 'RoleSearchTypeEnum',
    default: RoleSearchTypeEnum.ALL,
  })
  @IsEnum(RoleSearchTypeEnum)
  @IsOptional()
  type?: RoleSearchTypeEnum = RoleSearchTypeEnum.ALL;
}
