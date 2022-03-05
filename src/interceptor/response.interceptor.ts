import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { SYSTEM_CODE } from 'shared/system-code';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<any, any> {
  protected logger = new Logger(this.constructor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const res: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response: any) => {
        return {
          data: response,
          statusCode: SYSTEM_CODE.SUCCESS,
        };
      }),
      catchError(async (err: HttpException | Error | BadRequestException) => {
        let httpCode = 500;

        if (err instanceof HttpException) {
          httpCode = err && err.getStatus ? err.getStatus() : httpCode;
          res.status(httpCode);
        } else {
          httpCode = res.statusCode;
        }
        let statusCode = SYSTEM_CODE.SORRY_SOMETHING_WENT_WRONG;
        if (httpCode === 400) {
          statusCode = SYSTEM_CODE.BAD_REQUEST;
        } else if (httpCode === 401) {
          statusCode = SYSTEM_CODE.UNAUTHORIZED;
        } else if (httpCode === 403) {
          statusCode = SYSTEM_CODE.FORBIDDEN;
        }

        let errorStack = err.stack;
        if (err instanceof BadRequestException) {
          const validators = (err.getResponse() as any)?.message;
          if (typeof validators === 'string') {
            return {
              data: null,
              statusCode: validators,
              stack: errorStack,
            };
          }
          const stacks = [];
          (validators || []).forEach((item) => {
            stacks.push(...Object.values(item.constraints));
          });
          errorStack = stacks.join(',\n');
          this.logger.error(errorStack);
        } else if (err instanceof Error) {
          errorStack = err.stack;
        }

        return {
          data: null,
          statusCode: statusCode,
          stack: errorStack,
        };
      }),
    );
  }
}
