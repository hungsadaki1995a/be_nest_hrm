import { ResponseDto } from '@/dtos/response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiResponseMessage() {
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      schema: {
        $ref: getSchemaPath(ResponseDto),
      },
    }),
  );
}
