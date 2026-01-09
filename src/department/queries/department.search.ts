import { Prisma } from '@prisma/client';
import { DepartmentSearchDto } from '../dtos/department.search.dto';
import { icontains } from '@/utils/search.util';
import { DepartmentSearchTypeEnum } from '../constants/department.search.constant';

export function buildDepartmentWhere(
  dto: DepartmentSearchDto,
): Prisma.DepartmentWhereInput {
  const { query, type } = dto;

  if (!query) return {};

  switch (type) {
    case DepartmentSearchTypeEnum.CODE:
      return { code: icontains(query) };

    case DepartmentSearchTypeEnum.NAME:
      return { name: icontains(query) };

    case DepartmentSearchTypeEnum.HEAD:
      return {
        head: {
          is: {
            OR: [
              { fullName: icontains(query) },
              { employeeId: icontains(query) },
              { email: icontains(query) },
              { phoneNumber: icontains(query) },
            ],
          },
        },
      };

    case DepartmentSearchTypeEnum.TEAM:
      return {
        teams: {
          some: {
            OR: [{ code: icontains(query) }, { name: icontains(query) }],
          },
        },
      };

    case DepartmentSearchTypeEnum.ALL:
    default:
      return {
        OR: [{ code: icontains(query) }, { name: icontains(query) }],
      };
  }
}
