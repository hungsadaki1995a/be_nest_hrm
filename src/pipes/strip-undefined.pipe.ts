import { stripUndefined } from '@/utils/data-format.util';
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class StripUndefinedPipe implements PipeTransform {
  transform<T>(value: T): T {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    return stripUndefined(value as Record<string, unknown>) as T;
  }
}
