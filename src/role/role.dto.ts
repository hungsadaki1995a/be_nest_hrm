import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty({ example: 'DEV' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Developer' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Developer role' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class RoleResponseDto {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: 'DEV' })
  code: string;

  @ApiProperty({ example: 'Developer' })
  name: string;

  @ApiProperty({ example: 'Developer role' })
  description?: string;
}
