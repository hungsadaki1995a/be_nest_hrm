import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ required: false, nullable: true, type: Object })
  data?: unknown;

  @ApiProperty({ required: false, nullable: true, type: Object })
  description?: unknown;
}
