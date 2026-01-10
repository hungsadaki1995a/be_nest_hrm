import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/app.exception';
import { getMessage } from '@/utils/message.util';
import { ERROR_MESSAGE } from '@/constants/message.constant';

interface ThrowIfMissingOptions {
  field?: string;
  message?: string;
  status?: HttpStatus;
}

interface ThrowIfTrueOptions extends Omit<
  ThrowIfMissingOptions,
  'field' | 'message'
> {
  message: string;
}

// Becareful when use with object - NonNullable do not deep check object
export function throwIfMissing<T>(
  value: T,
  options: ThrowIfMissingOptions = {},
): asserts value is NonNullable<T> {
  const { field = 'Field', message, status = HttpStatus.BAD_REQUEST } = options;

  if (!value) {
    throw new AppException(
      message || getMessage(ERROR_MESSAGE.required, [field]),
      status,
    );
  }
}

export function throwIfTrue(
  condition: boolean,
  options: ThrowIfTrueOptions,
): asserts condition is false {
  const { message, status = HttpStatus.BAD_REQUEST } = options;

  if (condition) {
    throw new AppException(message, status);
  }
}

export function throwIfFalse(
  condition: boolean,
  options: ThrowIfTrueOptions,
): asserts condition is true {
  const { message, status = HttpStatus.BAD_REQUEST } = options;

  if (!condition) {
    throw new AppException(message, status);
  }
}
