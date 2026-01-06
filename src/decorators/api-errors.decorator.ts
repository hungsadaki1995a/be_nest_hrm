import { AppErrorResponseDto } from '@/dtos/error-response.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export function ApiAppErrors() {
  return applyDecorators(
    ApiBadRequestResponse({ type: AppErrorResponseDto }),
    ApiUnauthorizedResponse({ type: AppErrorResponseDto }),
    ApiForbiddenResponse({ type: AppErrorResponseDto }),
    ApiNotFoundResponse({ type: AppErrorResponseDto }),
    ApiInternalServerErrorResponse({ type: AppErrorResponseDto }),
  );
}
