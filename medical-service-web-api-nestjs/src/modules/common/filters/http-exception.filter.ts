// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../response/api-response';

/**
 * Bắt toàn bộ exception trong app và chuẩn hóa về một format duy nhất.
 *
 * Các trường hợp xử lý:
 *   - HttpException (bao gồm BadRequestException từ ValidationPipe)
 *   - Mongoose duplicate key error (code 11000)
 *   - Lỗi không xác định → 500
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;

    const { statusCode, message } = this.resolveException(exception);

    this.logger.error(
      `[${request.method}] ${path} → ${statusCode}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json(ApiResponse.error(statusCode, message, path));
  }

  // ─── Resolve ─────────────────────────────────────────────────────────────

  private resolveException(exception: unknown): {
    statusCode: number;
    message: string;
  } {
    // 1. HttpException — bao gồm BadRequestException, UnauthorizedException...
    if (exception instanceof HttpException) {
      return this.resolveHttpException(exception);
    }

    // 2. Mongoose duplicate key error
    if (this.isMongooseDuplicateKeyError(exception)) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: this.buildDuplicateKeyMessage(exception as MongoError),
      };
    }

    // 3. Lỗi không xác định
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.',
    };
  }

  private resolveHttpException(exception: HttpException): {
    statusCode: number;
    message: string;
  } {
    const statusCode = exception.getStatus();
    const res = exception.getResponse();

    // BadRequestException từ class-validator trả về object dạng:
    // { statusCode, message: string[], error: string }
    if (typeof res === 'object' && res !== null) {
      const body = res as Record<string, unknown>;

      // Nhiều lỗi validation → gộp thành 1 chuỗi, dễ đọc
      if (Array.isArray(body.message)) {
        return {
          statusCode,
          message: (body.message as string[]).join('; '),
        };
      }

      // Lỗi đơn (chuỗi)
      if (typeof body.message === 'string') {
        return { statusCode, message: body.message };
      }
    }

    // Fallback: exception.message
    if (typeof res === 'string') {
      return { statusCode, message: res };
    }

    return { statusCode, message: exception.message };
  }

  // ─── Mongoose helpers ─────────────────────────────────────────────────────

  private isMongooseDuplicateKeyError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      (exception as MongoError).code === 11000
    );
  }

  private buildDuplicateKeyMessage(error: MongoError): string {
    // keyValue: { email: 'test@ccmg.vn' }
    const keyValue = error.keyValue;

    if (keyValue) {
      const [field] = Object.keys(keyValue);
      const fieldLabel = FIELD_LABELS[field] ?? field;
      return `${fieldLabel} đã được sử dụng.`;
    }

    return 'Dữ liệu bị trùng lặp.';
  }
}

// ─── Types / Constants ────────────────────────────────────────────────────────

interface MongoError {
  code: number;
  keyValue?: Record<string, unknown>;
}

/** Map field name sang tên thân thiện hơn cho user */
const FIELD_LABELS: Record<string, string> = {
  email: 'Email',
  zaloId: 'Tài khoản Zalo',
  phoneNumber: 'Số điện thoại',
};