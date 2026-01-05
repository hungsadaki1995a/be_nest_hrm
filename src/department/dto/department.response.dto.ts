import { DepartmentShortDto, TeamShortDto, UserShortDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class DepartmentResponseDto extends DepartmentShortDto {
  @Type(() => UserShortDto)
  @ApiProperty({
    nullable: true,
    type: () => UserShortDto,
  })
  head?: UserShortDto | null;

  @ApiProperty({ type: () => [TeamShortDto] })
  @ValidateNested({ each: true })
  @Type(() => TeamShortDto)
  teams: TeamShortDto[];

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
