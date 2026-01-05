import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
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
  permissions: Record<string, ('C' | 'R' | 'U' | 'D')[]>;
}
