import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortField, SortOrder } from '@/types/sort.type';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/constants/pagination.constant';
import {
  transformSortBy,
  transformSortOrder,
} from '@/utils/sort-transformer.util';

export class SearchQueryDto {
  @ApiPropertyOptional({ description: 'Search all fields' })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    example: DEFAULT_PAGE,
    description: 'Page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    example: DEFAULT_PAGE_SIZE,
    description: 'Page size',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({
    enum: SortField,
    default: SortField.CREATED_AT,
    example: SortField.CREATED_AT,
    description: 'Sort by',
  })
  @Transform(transformSortBy)
  @IsEnum(SortField)
  @IsOptional()
  sortBy: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC,
    description: 'Order',
  })
  @Transform(transformSortOrder)
  @IsEnum(SortOrder)
  @IsOptional()
  orderBy: SortOrder = SortOrder.DESC;
}
