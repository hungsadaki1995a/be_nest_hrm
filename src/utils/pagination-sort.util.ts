import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/constants/pagination.constant';
import { SortOrderEnum } from '@/types/sort.type';

export interface NormalizedQuery<TSortField extends string> {
  page: number;
  limit: number;
  sortBy: TSortField;
  orderBy: SortOrderEnum;
}

export function normalizePaginationAndSort<TSortField extends string>(
  query: {
    page?: number;
    limit?: number;
    sortBy?: TSortField;
    orderBy?: SortOrderEnum;
  },
  defaults: {
    sortBy: TSortField;
    orderBy?: SortOrderEnum;
  },
) {
  return {
    page: query.page ?? DEFAULT_PAGE,
    limit: query.limit ?? DEFAULT_PAGE_SIZE,
    sortBy:
      query.sortBy ?? defaults?.sortBy ?? (undefined as unknown as TSortField),
    orderBy: query.orderBy ?? defaults?.orderBy ?? SortOrderEnum.DESC,
  };
}
