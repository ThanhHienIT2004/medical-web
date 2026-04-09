import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export type RequestWithUserData = Request & { user_data?: User };

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const req = context.switchToHttp().getRequest<RequestWithUserData>();
    return req.user_data;
  },
);