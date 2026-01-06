import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppException } from './app.exception';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';
import { StripUndefinedPipe } from './pipes/strip-undefined.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory(errors) {
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
    }),
    new StripUndefinedPipe(),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('HRM API')
    .setDescription('HRM API Document')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
