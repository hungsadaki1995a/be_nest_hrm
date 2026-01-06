import { DepartmentBaseDto } from '@/dtos/department-short.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class DepartmentCreateDto extends DepartmentBaseDto {
  @ApiProperty({
    required: true,
    example: 3,
    description: "User ID of department's head",
  })
  @IsInt()
  @IsOptional()
  headId: number;
}

export class DepartmentUpdateDto extends PartialType(
  OmitType(DepartmentCreateDto, ['code'] as const),
) {}
