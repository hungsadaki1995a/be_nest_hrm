import { ValidationPipe, HttpStatus, ValidationError } from '@nestjs/common';
import { AppException } from '@/app.exception';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory(errors: ValidationError[]) {
        console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));

        const messages = errors
          .map((err) => {
            if (err.constraints) {
              return Object.values(err.constraints);
            }
            return [];
          })
          .flat();

        return new AppException(
          messages.join(', '),
          HttpStatus.BAD_REQUEST,
          'VALIDATION_ERROR',
        );
      },
    });
  }
}
