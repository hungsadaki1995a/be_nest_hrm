import { TeamShortDto, UserShortDto } from '@/common/dto';
import { DepartmentShortDto } from '@/common/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class TeamResponseDto extends TeamShortDto {
  @Type(() => DepartmentShortDto)
  @ApiProperty({ type: () => DepartmentShortDto })
  department: DepartmentShortDto;

  @Type(() => UserShortDto)
  @ApiPropertyOptional({ type: () => UserShortDto, nullable: true })
  leader?: UserShortDto | null;

  @ApiProperty({ type: () => [UserShortDto] })
  @ValidateNested({ each: true })
  @Type(() => UserShortDto)
  members: UserShortDto[];

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-02T15:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
