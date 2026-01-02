import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SortOrder } from '@/common/constants';

export interface NormalizedQuery<TSortField extends string> {
  page: number;
  limit: number;
  sortBy: TSortField;
  orderBy: SortOrder;
}

export function normalizePaginationAndSort<TSortField extends string>(
  query: {
    page?: number;
    limit?: number;
    sortBy?: TSortField;
    orderBy?: SortOrder;
  },
  defaults: {
    sortBy: TSortField;
    orderBy?: SortOrder;
  },
): NormalizedQuery<TSortField> {
  return {
    page: query.page ?? DEFAULT_PAGE,
    limit: query.limit ?? DEFAULT_PAGE_SIZE,
    sortBy: query.sortBy ?? defaults.sortBy,
    orderBy: query.orderBy ?? defaults.orderBy ?? SortOrder.DESC,
  };
}
