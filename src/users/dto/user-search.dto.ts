import { SearchQueryDto } from '@/dtos/search-query.dto';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserSearchDto extends OmitType(SearchQueryDto, [
  'query',
] as const) {
  @ApiPropertyOptional({ description: 'Search by name or employee id' })
  @IsString()
  @IsOptional()
  query?: string;
}
