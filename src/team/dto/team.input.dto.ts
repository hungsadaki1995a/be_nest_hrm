import { TeamBaseDto } from '@/common/dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt, IsOptional } from 'class-validator';

export class TeamCreateDto extends TeamBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Department ID this team belongs to',
  })
  @IsInt()
  departmentId: number;

  @ApiPropertyOptional({
    nullable: true,
    example: 10,
    description: 'User ID of team leader',
  })
  @IsInt()
  @IsOptional()
  leaderId?: number | null;

  @ApiPropertyOptional({
    example: [10, 11, 12],
    type: [Number],
    description: 'User IDs of team members',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  memberIds?: number[];
}

export class TeamUpdateDto extends PartialType(
  OmitType(TeamCreateDto, ['code'] as const),
) {}
