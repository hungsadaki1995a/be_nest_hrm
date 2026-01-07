import { DepartmentBaseDto } from '@/dtos/department-short.dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt, IsOptional } from 'class-validator';

export class DepartmentCreateDto extends DepartmentBaseDto {
  @ApiProperty({
    required: true,
    example: 3,
    description: "User ID of department's head",
  })
  @IsInt()
  @IsOptional()
  headId: number;

  @ApiPropertyOptional({
    example: [10, 11, 12],
    type: [Number],
    description: 'User IDs of team members',
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  teamIds?: number[];
}

export class DepartmentUpdateDto extends PartialType(
  OmitType(DepartmentCreateDto, ['code'] as const),
) {}
