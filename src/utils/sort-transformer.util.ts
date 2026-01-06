import { SortOrder } from '@/types/sort.type';
import { TransformFnParams } from 'class-transformer';

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

export function transformSortBy<T extends string>(enumObj: Record<string, T>) {
  return ({ value }: TransformFnParams): T | undefined => {
    if (typeof value !== 'string') return undefined;

    return Object.values(enumObj).includes(value as T)
      ? (value as T)
      : undefined;
  };
}

export function applySortOrder<T extends Record<string, any>>(
  template: T,
  order: SortOrder,
): T {
  return Object.fromEntries(
    Object.entries(template).map(([k, v]) => [
      k,
      typeof v === 'object' ? applySortOrder(v, order) : order,
    ]),
  ) as T;
}
