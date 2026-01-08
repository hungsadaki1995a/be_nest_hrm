import { icontains } from '@/utils/search.util';
import { Prisma } from '@prisma/client';
import { RoleSearchType } from '../constants/role.search.constant';
import { RoleSearchDto } from '../dtos/role.search.dto';

export function buildRoleWhere(dto: RoleSearchDto): Prisma.RoleWhereInput {
  const { query, type } = dto;

  if (!query) return {};

  switch (type) {
    case RoleSearchType.CODE:
      return { code: icontains(query) };

    case RoleSearchType.NAME:
      return { name: icontains(query) };

    case RoleSearchType.ALL:
    default:
      return {
        OR: [{ code: icontains(query) }, { name: icontains(query) }],
      };
  }
}
