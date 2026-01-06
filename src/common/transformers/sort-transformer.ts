import { SortField, SortOrder } from '@/types/sort.type';

function isSortOrder(value: string): value is SortOrder {
  return Object.values(SortOrder).includes(value as SortOrder);
}

export function transformSortOrder({
  value,
}: {
  value?: unknown;
}): SortOrder | undefined {
  if (typeof value !== 'string') return;

  const v = value.toLowerCase();

  if (isSortOrder(v)) {
    return v;
  }

  return;
}

export function transformSortBy({
  value,
}: {
  value?: unknown;
}): SortField | undefined {
  if (typeof value !== 'string') return;

  if (Object.values(SortField).includes(value as SortField)) {
    return value as SortField;
  }

  return;
}
