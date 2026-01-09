import { icontains } from '@/utils/search.util';
import { Prisma } from '@prisma/client';
import { RoleSearchTypeEnum } from '../constants/role.search.constant';
import { RoleSearchDto } from '../dtos/role.search.dto';

export function buildRoleWhere(dto: RoleSearchDto): Prisma.RoleWhereInput {
  const { query, type } = dto;

  if (!query) return {};

  switch (type) {
    case RoleSearchTypeEnum.CODE:
      return { code: icontains(query) };

    case RoleSearchTypeEnum.NAME:
      return { name: icontains(query) };

    case RoleSearchTypeEnum.ALL:
    default:
      return {
        OR: [{ code: icontains(query) }, { name: icontains(query) }],
      };
  }
}
