import { Prisma } from '@prisma/client';
import { DepartmentSearchDto } from '../dto/department.search.dto';
import { icontains } from '@/utils/search.util';

export function buildDepartmentWhere(
  dto: DepartmentSearchDto,
): Prisma.DepartmentWhereInput {
  const AND: Prisma.DepartmentWhereInput[] = [];

  if (dto.query) {
    AND.push({
      OR: [
        { code: icontains(dto.query) },
        { name: icontains(dto.query) },
        { description: icontains(dto.query) },
        {
          head: {
            is: {
              OR: [
                { fullName: icontains(dto.query) },
                { employeeId: icontains(dto.query) },
                { email: icontains(dto.query) },
                { phoneNumber: icontains(dto.query) },
              ],
            },
          },
        },
        {
          teams: {
            some: {
              OR: [
                { code: icontains(dto.query) },
                { name: icontains(dto.query) },
                { description: icontains(dto.query) },
              ],
            },
          },
        },
      ],
    });
  } else {
    if (dto.code) AND.push({ code: icontains(dto.code) });
    if (dto.name) AND.push({ name: icontains(dto.name) });
    if (dto.description) AND.push({ description: icontains(dto.description) });

    if (dto.head) {
      AND.push({
        head: {
          is: {
            OR: [
              { fullName: icontains(dto.head) },
              { employeeId: icontains(dto.head) },
              { email: icontains(dto.head) },
              { phoneNumber: icontains(dto.head) },
            ],
          },
        },
      });
    }

    if (dto.team) {
      AND.push({
        teams: {
          some: {
            OR: [
              { code: icontains(dto.team) },
              { name: icontains(dto.team) },
              { description: icontains(dto.team) },
            ],
          },
        },
      });
    }
  }

  return AND.length ? { AND } : {};
}
