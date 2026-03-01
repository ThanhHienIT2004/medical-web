import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

// Định nghĩa interface cho Request với user_data
interface GqlRequest {
  user_data?: User; // user_data khớp với kiểu User
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: GqlRequest }>().req;
    return req.user_data;
  },
);