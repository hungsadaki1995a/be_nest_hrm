import { Prisma } from '@prisma/client';
import { icontains } from '@/common/prisma';
import { TeamSearchDto } from '../dto/team.search.dto';

export function buildTeamWhere(dto: TeamSearchDto): Prisma.TeamWhereInput {
  const AND: Prisma.TeamWhereInput[] = [];

  if (dto.query) {
    AND.push({
      OR: [
        { code: icontains(dto.query) },
        { name: icontains(dto.query) },
        { description: icontains(dto.query) },
        {
          department: {
            is: {
              OR: [
                { code: icontains(dto.query) },
                { name: icontains(dto.query) },
                { description: icontains(dto.query) },
              ],
            },
          },
        },
        {
          leader: {
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
          members: {
            some: {
              user: {
                OR: [
                  { fullName: icontains(dto.query) },
                  { employeeId: icontains(dto.query) },
                  { email: icontains(dto.query) },
                  { phoneNumber: icontains(dto.query) },
                ],
              },
            },
          },
        },
      ],
    });
  } else {
    if (dto.code) AND.push({ code: icontains(dto.code) });
    if (dto.name) AND.push({ name: icontains(dto.name) });
    if (dto.description) AND.push({ description: icontains(dto.description) });

    if (dto.department) {
      AND.push({
        department: {
          is: {
            OR: [
              { code: icontains(dto.department) },
              { name: icontains(dto.department) },
              { description: icontains(dto.department) },
            ],
          },
        },
      });
    }

    if (dto.leader) {
      AND.push({
        leader: {
          is: {
            OR: [
              { fullName: icontains(dto.leader) },
              { employeeId: icontains(dto.leader) },
              { email: icontains(dto.leader) },
              { phoneNumber: icontains(dto.leader) },
            ],
          },
        },
      });
    }

    if (dto.member) {
      AND.push({
        members: {
          some: {
            user: {
              OR: [
                { fullName: icontains(dto.member) },
                { employeeId: icontains(dto.member) },
                { email: icontains(dto.member) },
                { phoneNumber: icontains(dto.member) },
              ],
            },
          },
        },
      });
    }
  }

  return AND.length ? { AND } : {};
}
