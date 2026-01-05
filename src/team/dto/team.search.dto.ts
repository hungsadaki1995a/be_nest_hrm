import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SearchQueryDto } from '@/common/dto/search-query.dto';

export class TeamSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({
    example: 'FE',
    description: 'Unique team code',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    example: 'Frontend',
    description: "Team's name",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'GDC Frontend Team',
    description: "Team's description",
    nullable: true,
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
