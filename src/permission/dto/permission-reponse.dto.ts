import { ApiProperty } from '@nestjs/swagger';

export enum PermissionPageCodeEnum {
  DASHBOARD = 'DASHBOARD',
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  DEPARTMENT = 'DEPARTMENT',
  TEAM = 'TEAM',
}

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
  permissions: Record<PermissionPageCodeEnum, ('C' | 'R' | 'U' | 'D')[]>;
}
