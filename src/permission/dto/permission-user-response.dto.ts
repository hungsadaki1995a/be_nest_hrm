import { ApiProperty } from '@nestjs/swagger';
import { PermissionPageCodeEnum } from '../enum/permission.enum';

export class PermissionUserResponseDto {
  @ApiProperty({
    example: {
      DASHBOARD: ['C', 'R', 'U', 'D'],
      USER: ['R', 'C', 'U'],
      ROLE: ['R'],
    },
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['C', 'R', 'U', 'D'],
      },
    },
  })
  permissions: Record<PermissionPageCodeEnum, ('C' | 'R' | 'U' | 'D')[]>;
}
