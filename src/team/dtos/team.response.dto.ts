import { DepartmentShortDto } from '@/dtos/department-short.dto';
import { TeamShortDto } from '@/dtos/team-short.dto';
import { UserShortDto } from '@/dtos/user-short.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class TeamResponseDto extends TeamShortDto {
  @Type(() => DepartmentShortDto)
  @ApiProperty({ type: () => DepartmentShortDto })
  department: DepartmentShortDto;

  @Type(() => UserShortDto)
  @ApiPropertyOptional({
    nullable: true,
    type: () => UserShortDto,
  })
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
