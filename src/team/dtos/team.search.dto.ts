import { SearchQueryDto } from '@/dtos/search-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TeamSearchType } from '../constants/team.search.constant';
import { TeamSortField } from '../constants/team.sort.constant';
import { Transform } from 'class-transformer';
import { transformSortBy } from '@/utils/sort-transformer.util';

export class TeamSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: TeamSortField,
    default: TeamSortField.CREATED_AT,
  })
  @Transform(transformSortBy(TeamSortField))
  @IsEnum(TeamSortField)
  @IsOptional()
  sortBy?: TeamSortField = TeamSortField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: TeamSearchType,
    default: TeamSearchType.ALL,
  })
  @IsEnum(TeamSearchType)
  @IsOptional()
  type?: TeamSearchType = TeamSearchType.ALL;
}
