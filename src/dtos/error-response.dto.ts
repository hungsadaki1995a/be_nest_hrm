import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiPropertyOptional({ example: 'ERROR_CODE' })
  errorCode?: string;

  @ApiProperty({ example: 'This is error message.' })
  message: string;

  @ApiProperty({
    example: '2026-01-01T10:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({ example: '/' })
  path: string;

  @ApiProperty({ example: 'GET' })
  method: string;
}
