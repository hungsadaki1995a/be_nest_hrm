import { ResponseDto } from '@/dtos/response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiResponseMessage({ message }: { message: string }) {
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              message: {
                example: message,
              },
            },
          },
        ],
      },
    }),
  );
}
