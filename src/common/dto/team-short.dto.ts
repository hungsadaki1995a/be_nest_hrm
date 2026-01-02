import { ApiProperty } from '@nestjs/swagger';
import { UserShortDto } from './user-short.dto';

export class TeamShortDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'FE' })
  code: string;

  @ApiProperty({ example: 'Frontend' })
  name: string;

  @ApiProperty({ example: 'GDC Frontend Team', nullable: true })
  description?: string | null;

  @ApiProperty({ type: UserShortDto, nullable: true })
  leader?: UserShortDto | null;

  @ApiProperty({ type: [UserShortDto] })
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
