import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from './response';

@Injectable()
export class ResponseInterceptor<
  T = unknown,
  D = unknown,
> implements NestInterceptor<T, ResponseModel<T, D> | T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseModel<T, D> | T> {
    const http = context.switchToHttp();
    const response: { statusCode?: number } | undefined = http.getResponse?.();
    return next.handle().pipe(
      map((data: T) => {
        if (data instanceof ResponseModel) {
          return data;
        }

        const status =
          response && typeof response.statusCode === 'number'
            ? response.statusCode
            : HttpStatus.OK;

        if (status === (HttpStatus.OK as number)) {
          return new ResponseModel<T, D>(HttpStatus.OK, 'OK', data);
        }

        return data;
      }),
    );
  }
}
