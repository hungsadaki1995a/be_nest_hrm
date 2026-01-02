import { TeamShortDto, UserShortDto } from '@/common/dto';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'GDC' })
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  name: string;

  @ApiProperty({ example: 'Global Development Center department' })
  description?: string;

  @ApiProperty({ type: UserShortDto, nullable: true })
  head?: UserShortDto | null;

  @ApiProperty({ type: () => [TeamShortDto] })
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

export class DepartmentShortResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'GDC' })
  code: string;

  @ApiProperty({ example: 'Global Development Center' })
  name: string;

  @ApiProperty({ example: 'Global Development Center department' })
  description?: string;

  @ApiProperty({ type: UserShortDto, nullable: true })
  head?: UserShortDto | null;

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
