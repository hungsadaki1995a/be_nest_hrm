import { SortFieldEnum } from '@/types/sort.type';
import { Prisma } from '@prisma/client';

export enum UserSortFieldEnum {
  CREATED_AT = SortFieldEnum.CREATED_AT,
  UPDATED_AT = SortFieldEnum.UPDATED_AT,
  EMPLOYEE_ID = 'employeeId',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
}

export const USER_SORT_MAP: Record<
  UserSortFieldEnum,
  Prisma.UserOrderByWithRelationInput
> = {
  createdAt: { createdAt: 'asc' },
  updatedAt: { updatedAt: 'asc' },
  employeeId: { employeeId: 'asc' },
  name: { fullName: 'asc' },
  email: { email: 'asc' },
  phone: { phoneNumber: 'asc' },
};
