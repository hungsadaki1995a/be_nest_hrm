import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/common/constants';

type StringSearch = {
  contains: string;
  mode: 'insensitive';
};

export function icontains(value?: string): StringSearch | undefined {
  if (!value) return;
  return { contains: value, mode: 'insensitive' };
}

export function buildPagination(
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
) {
  const take = limit;
  const skip = (page - DEFAULT_PAGE) * limit;
  return { take, skip };
}
