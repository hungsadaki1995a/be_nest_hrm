import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/constants/pagination.constant';
import { SortField, SortOrder } from '@/types/sort.type';

export interface NormalizedQuery<TSortField extends string> {
  page: number;
  limit: number;
  sortBy: TSortField;
  orderBy: SortOrder;
}

export function normalizePaginationAndSort(
  query: {
    page?: number;
    limit?: number;
    sortBy?: SortField;
    orderBy?: SortOrder;
  },
  defaults?: {
    sortBy?: SortField;
    orderBy?: SortOrder;
  },
): NormalizedQuery<SortField> {
  return {
    page: query.page ?? DEFAULT_PAGE,
    limit: query.limit ?? DEFAULT_PAGE_SIZE,
    sortBy: query.sortBy ?? defaults?.sortBy ?? SortField.CREATED_AT,
    orderBy: query.orderBy ?? defaults?.orderBy ?? SortOrder.DESC,
  };
}
