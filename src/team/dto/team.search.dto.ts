import { SearchQueryDto } from '@/dtos/search-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamSearchType } from '../constants/team.search';
import { TeamSortField } from '../constants/team.sort';
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

  @ApiPropertyOptional({
    description: 'Unique team code',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: "Team's name",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    nullable: true,
    description: "Team's description",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Search by Department (name, code, description)',
  })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    description: 'Search by Leader User (name, employee ID, email, phone)',
  })
  @IsString()
  @IsOptional()
  leader?: string;

  @ApiPropertyOptional({
    description: 'Search by Member User (name, employee ID, email, phone)',
  })
  @IsString()
  @IsOptional()
  member?: string;
}
