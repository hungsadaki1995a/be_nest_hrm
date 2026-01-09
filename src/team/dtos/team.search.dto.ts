import { SearchQueryDto } from '@/dtos/search-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TeamSearchTypeEnum } from '../constants/team.search.constant';
import { TeamSortFieldEnum } from '../constants/team.sort.constant';
import { Transform } from 'class-transformer';
import { transformSortBy } from '@/utils/sort-transformer.util';

export class TeamSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: TeamSortFieldEnum,
    enumName: 'TeamSortFieldEnum',
    default: TeamSortFieldEnum.CREATED_AT,
  })
  @Transform(transformSortBy(TeamSortFieldEnum))
  @IsEnum(TeamSortFieldEnum)
  @IsOptional()
  sortBy?: TeamSortFieldEnum = TeamSortFieldEnum.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: TeamSearchTypeEnum,
    enumName: 'TeamSearchTypeEnum',
    default: TeamSearchTypeEnum.ALL,
  })
  @IsEnum(TeamSearchTypeEnum)
  @IsOptional()
  type?: TeamSearchTypeEnum = TeamSearchTypeEnum.ALL;
}
