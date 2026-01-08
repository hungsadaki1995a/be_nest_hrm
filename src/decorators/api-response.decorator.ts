import { ResponseDto } from '@/dtos/response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiResponse<T>(model: Type<T>, isArray = false) {
  return applyDecorators(
    ApiExtraModels(ResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
}
