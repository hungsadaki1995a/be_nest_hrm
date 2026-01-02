import { ApiProperty } from '@nestjs/swagger';

export class UserShortDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
