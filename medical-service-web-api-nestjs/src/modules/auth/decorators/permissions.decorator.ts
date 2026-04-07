import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator để đánh dấu các permissions cần thiết cho một route.
 *
 * @example
 * // Yêu cầu user phải có quyền đọc user
 * @Permissions(Permission.USER_READ)
 * @Get()
 * findAll() {}
 *
 * @example
 * // Yêu cầu nhiều quyền cùng lúc (AND logic - phải có TẤT CẢ)
 * @Permissions(Permission.APPOINTMENT_READ, Permission.DOCTOR_READ)
 * @Get('appointments')
 * findAppointments() {}
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
