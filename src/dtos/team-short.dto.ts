import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class TeamBaseDto {
  @ApiProperty({
    example: 'FE',
    description: 'Unique Team code (3–5 chars)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  code: string;

  @ApiProperty({
    example: 'Frontend',
    description: "Team's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'GDC Frontend Team',
    description: 'Describe about team',
  })
  @ValidateIf((o: TeamBaseDto) => o.description !== null)
  @IsString()
  @IsOptional()
  description?: string | null;
}

export class TeamShortDto extends TeamBaseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique Team ID',
  })
  id: number;
}
