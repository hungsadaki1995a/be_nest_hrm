import { AppException } from '@/app.exception';
import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface PrismaErrorOptions {
  module?: string;
  entity?: string;
  customMessages?: Partial<Record<string, string>>;
}

const DEFAULT_MESSAGES: Record<string, string> = {
  P2002: 'already exists',
  P2003: 'relation violation',
  P2004: 'database constraint violation',
  P2005: 'invalid value for field',
  P2006: 'invalid string for enum',
  P2007: 'data too long',
  P2008: 'invalid date format',
  P2009: 'missing required argument',
  P2010: 'unique constraint failed on multiple fields',
  P2011: 'null constraint violation',
  P2012: 'foreign key constraint failed',
  P2013: 'constraint violation',
  P2014: 'constraint violation',
  P2015: 'constraint violation',
  P2016: 'constraint violation',
  P2017: 'constraint violation',
  P2018: 'constraint violation',
  P2019: 'constraint violation',
  P2020: 'constraint violation',
  P2021: 'constraint violation',
  P2022: 'constraint violation',
  P2023: 'constraint violation',
  P2024: 'constraint violation',
  P2025: 'record not found',
  P2030: 'constraint violation',
  P2034: 'constraint violation',
  P2035: 'constraint violation',
  P2036: 'constraint violation',
  P2037: 'constraint violation',
};

const handleFields = (fields: unknown) => {
  if (Array.isArray(fields)) {
    return fields.join(', ');
  }

  if (typeof fields === 'string') {
    return fields;
  }

  if (typeof fields === 'object' && fields !== null) {
    return Object.keys(fields).join(', ');
  }

  return 'unknown field';
};

export function handlePrismaError(
  error: unknown,
  options?: PrismaErrorOptions,
): never {
  const moduleName = options?.module ? `[${options.module}] ` : '';
  const entity = options?.entity || 'Record';
  const messages = { ...DEFAULT_MESSAGES, ...(options?.customMessages || {}) };

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const code = error.code;
    const baseMessage = messages[code] || 'database error';

    let detail = '';

    if (code === 'P2002') {
      const fields = handleFields(error.meta?.target);

      detail = ` with same ${fields}`;

      throw new AppException(
        `${moduleName}${entity} ${baseMessage}${detail}`,
        HttpStatus.CONFLICT,
      );
    }

    if (code === 'P2025') {
      throw new AppException(
        `${moduleName}${entity} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (code === 'P2003') {
      const fields = handleFields(error.meta?.field_name);

      detail = fields ? ` on field ${fields}` : '';

      throw new AppException(
        `${moduleName}${entity} ${baseMessage}${detail}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new AppException(
      `${moduleName}${entity} ${baseMessage}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  throw error;
}
