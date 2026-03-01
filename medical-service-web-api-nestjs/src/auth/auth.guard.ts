import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{
      req: { headers: Record<string, string | undefined>; user_data?: User };
    }>().req;

    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      });

      if (!payload.email) {
        throw new UnauthorizedException('Token không hợp lệ: thiếu email');
      }

      const user = await this.userService.findByEmail(payload.email);
      req.user_data = user;

      // ✅ Kiểm tra role nếu có yêu cầu
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Bạn không có quyền truy cập');
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Lỗi xác thực token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException(
        'Token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private extractToken(req: {
    headers: Record<string, string | undefined>;
  }): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ') as [
        string | undefined,
        string | undefined,
    ];
    return type === 'Bearer' && token ? token : undefined;
  }
}
