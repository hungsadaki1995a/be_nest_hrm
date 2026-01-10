import { Prisma } from '@prisma/client';
import { icontains } from '@/utils/search.util';
import { UserSearchTypeEnum } from '../constants/user.search.constant';
import { UserSearchDto } from '../dtos/user.search.dto';

export function buildUserWhere(dto: UserSearchDto): Prisma.UserWhereInput {
  const { query, type } = dto;

  if (!query) return {};

  switch (type) {
    case UserSearchTypeEnum.EMPLOYEE_ID:
      return { employeeId: icontains(query) };

    case UserSearchTypeEnum.NAME:
      return { fullName: icontains(query) };

    case UserSearchTypeEnum.EMAIL:
      return { email: icontains(query) };

    case UserSearchTypeEnum.PHONE:
      return { phoneNumber: icontains(query) };

    case UserSearchTypeEnum.ALL:
    default:
      return {
        OR: [
          { employeeId: icontains(query) },
          { fullName: icontains(query) },
          { email: icontains(query) },
          { phoneNumber: icontains(query) },
        ],
      };
  }
}
