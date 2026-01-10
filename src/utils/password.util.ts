import { AppException } from '@/app.exception';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getMessage } from './message.util';
import { ERROR_MESSAGE } from '@/constants/message.constant';

export const hashPassword = async (password: string) => {
  if (!password) {
    throw new AppException(
      getMessage(ERROR_MESSAGE.required, ['Password']),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return await bcrypt.hash(password, 10);
};
