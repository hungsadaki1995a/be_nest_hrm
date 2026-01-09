import { RoleBaseDto } from '@/dtos/role-short.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class RoleCreateDto extends RoleBaseDto { }

export class UpdateRoleDto extends PartialType(
  (RoleBaseDto),
) { }
