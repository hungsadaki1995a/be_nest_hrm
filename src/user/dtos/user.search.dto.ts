import { SearchQueryDto } from '@/dtos/search-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformSortBy } from '@/utils/sort-transformer.util';
import { UserSortFieldEnum } from '../constants/user.sort.constant';
import { UserSearchTypeEnum } from '../constants/user.search.constant';

export class UserSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: UserSortFieldEnum,
    enumName: 'UserSortFieldEnum',
    default: UserSortFieldEnum.CREATED_AT,
  })
  @Transform(transformSortBy(UserSortFieldEnum))
  @IsEnum(UserSortFieldEnum)
  @IsOptional()
  sortBy?: UserSortFieldEnum = UserSortFieldEnum.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Type of search',
    enum: UserSearchTypeEnum,
    enumName: 'UserSearchTypeEnum',
    default: UserSearchTypeEnum.ALL,
  })
  @IsEnum(UserSearchTypeEnum)
  @IsOptional()
  type?: UserSearchTypeEnum = UserSearchTypeEnum.ALL;
}
