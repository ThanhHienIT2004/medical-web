import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  ConflictException,
  NotFoundException,

} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    GqlArgumentsHost.create(host);

    // Log lỗi ra console để dễ debug
    console.error('GraphQL Exception:', exception);

    let message = 'Lỗi không xác định';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof GraphQLError) {
      throw exception;
    }

    if (exception instanceof NotFoundException) {
      message = exception.message;
      code = 'NOT_FOUND';
    } else if (exception instanceof ConflictException) {
      message = exception.message;
      code = 'CONFLICT';
    } else if (this.hasMessage(exception)) {
      message = exception.message;
    }

    throw new GraphQLError(message, {
      extensions: {
        code,
        stacktrace: this.extractStacktrace(exception),
      },
    });
  }

  private hasMessage(obj: unknown): obj is { message: string } {
    return typeof obj === 'object' && obj !== null && 'message' in obj;
  }

  private extractStacktrace(obj: unknown): string[] | undefined {
    if (typeof obj === 'object' && obj !== null && 'stack' in obj) {
      const stack = (obj as { stack: string }).stack;
      return stack?.split('\n');
    }
    return undefined;
  }
}
