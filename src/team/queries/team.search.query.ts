import { Prisma } from '@prisma/client';
import { TeamSearchDto } from '../dtos/team.search.dto';
import { icontains } from '@/utils/search.util';
import { TeamSearchTypeEnum } from '../constants/team.search.constant';

export function buildTeamWhere(dto: TeamSearchDto): Prisma.TeamWhereInput {
  const { query, type } = dto;

  if (!query) return {};

  switch (type) {
    case TeamSearchTypeEnum.CODE:
      return { code: icontains(query) };

    case TeamSearchTypeEnum.NAME:
      return { name: icontains(query) };

    case TeamSearchTypeEnum.LEADER:
      return {
        leader: {
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

    case TeamSearchTypeEnum.MEMBER:
      return {
        members: {
          some: {
            user: {
              OR: [
                { fullName: icontains(query) },
                { employeeId: icontains(query) },
                { email: icontains(query) },
                { phoneNumber: icontains(query) },
              ],
            },
          },
        },
      };

    case TeamSearchTypeEnum.DEPARTMENT:
      return {
        department: {
          is: {
            OR: [
              { code: icontains(query) },
              { name: icontains(query) },
              { description: icontains(query) },
            ],
          },
        },
      };

    case TeamSearchTypeEnum.ALL:
    default:
      return {
        OR: [
          { code: icontains(query) },
          { name: icontains(query) },
          {
            department: {
              is: {
                OR: [
                  { code: icontains(query) },
                  { name: icontains(query) },
                  { description: icontains(query) },
                ],
              },
            },
          },
          {
            leader: {
              is: {
                OR: [
                  { fullName: icontains(query) },
                  { employeeId: icontains(query) },
                  { email: icontains(query) },
                  { phoneNumber: icontains(query) },
                ],
              },
            },
          },
          {
            members: {
              some: {
                user: {
                  OR: [
                    { fullName: icontains(query) },
                    { employeeId: icontains(query) },
                    { email: icontains(query) },
                    { phoneNumber: icontains(query) },
                  ],
                },
              },
            },
          },
        ],
      };
  }
}
