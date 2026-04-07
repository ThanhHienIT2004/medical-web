// src/common/interceptors/response.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponseShape } from '../response/api-response';


/**
 * Wrap toàn bộ success response về format chuẩn.
 *
 * Controller trả về bất kỳ object nào, interceptor sẽ bọc lại thành:
 * {
 *   statusCode, success, data, message, timestamp, path
 * }
 *
 * Nếu controller đã trả về object có field "success" (ví dụ tự build sẵn)
 * thì interceptor sẽ pass-through, không wrap lại để tránh double-wrap.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseShape<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseShape<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Nếu controller tự trả về ApiResponseShape thì không wrap lại
        if (this.isAlreadyWrapped(data)) {
          return data as unknown as ApiResponseShape<T>;
        }

        return {
          statusCode: response.statusCode,
          success: true,
          data: data ?? null,
          message: 'OK',
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private isAlreadyWrapped(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'statusCode' in data
    );
  }
}