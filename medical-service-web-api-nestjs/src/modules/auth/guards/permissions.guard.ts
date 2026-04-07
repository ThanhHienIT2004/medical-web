import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Permission } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLE_PERMISSIONS } from '../constants/role-permissions.constant';

/**
 * PermissionsGuard - Kiểm tra quyền granular dựa trên role của user.
 *
 * ⚠️  Guard này phải được dùng SAU AuthGuard vì cần req.user_data đã được set.
 *
 * Cách dùng:
 * @UseGuards(AuthGuard, PermissionsGuard)
 * @Permissions(Permission.USER_READ)
 * @Get()
 * findAll() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách permissions yêu cầu từ metadata
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không có yêu cầu permission nào → cho phép truy cập
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user_data?: User }>();
    const user = request.user_data;

    // Nếu chưa có user (chưa qua AuthGuard) → từ chối
    if (!user) {
      this.logger.warn(
        'PermissionsGuard: user_data not found in request. Make sure AuthGuard runs first.',
      );
      throw new ForbiddenException('Không xác định được người dùng');
    }

    const userRole = user.role;
    const grantedPermissions: Permission[] =
      ROLE_PERMISSIONS[userRole] ?? [];

    this.logger.debug(
      `User [${user.email}] | Role: ${userRole} | Required: [${requiredPermissions.join(', ')}]`,
    );

    // Kiểm tra user có ĐỦ TẤT CẢ permissions yêu cầu không
    const hasAllPermissions = requiredPermissions.every((permission) =>
      grantedPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      const missing = requiredPermissions.filter(
        (p) => !grantedPermissions.includes(p),
      );
      this.logger.warn(
        `User [${user.email}] bị từ chối. Thiếu quyền: [${missing.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Bạn không có quyền thực hiện hành động này. Cần: [${missing.join(', ')}]`,
      );
    }

    return true;
  }
}
