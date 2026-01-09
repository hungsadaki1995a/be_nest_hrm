import { SortOrderEnum } from '@/types/sort.type';
import { TransformFnParams } from 'class-transformer';

function isSortOrder(value: string): value is SortOrderEnum {
  return Object.values(SortOrderEnum).includes(value as SortOrderEnum);
}

export function transformSortOrder({
  value,
}: {
  value?: unknown;
}): SortOrderEnum | undefined {
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
  order: SortOrderEnum,
): T {
  return Object.fromEntries(
    Object.entries(template).map(([k, v]) => [
      k,
      typeof v === 'object' ? applySortOrder(v, order) : order,
    ]),
  ) as T;
}
