import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import {
  UpdateUserDto,
  ForgotPasswordDto,
} from './dto/user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ResetPasswordDto } from './dto/user.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ApiResponse } from '../common/response/api-response';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ─── GET ALL: chỉ ADMIN hoặc DOCTOR mới có quyền USER_READ ─────────────────
  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách users (phân trang) - Yêu cầu quyền user:read' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ) {
    const result = await this.userService.getAllUsers({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });

    return ApiResponse.success(
      result,
      'Lấy danh sách users thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── GET by ID: cần đăng nhập & có quyền USER_READ ─────────────────────────
  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy user theo ID - Yêu cầu quyền user:read' })
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const result = await this.userService.findById(id);

    return ApiResponse.success(
      result,
      'Lấy user theo ID thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── GET by Email ───────────────────────────────────────────────────────────
  @Get('email/:email')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy user theo email - Yêu cầu quyền user:read' })
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(
    @Req() req: Request,
    @Param('email') email: string,
  ) {
    const result = await this.userService.findByEmail(email);

    return ApiResponse.success(
      result,
      'Lấy user theo email thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── UPDATE: cần quyền USER_UPDATE ─────────────────────────────────────────
  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin user - Yêu cầu quyền user:update' })
  async updateUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    const result = await this.userService.update(id, input);

    return ApiResponse.success(
      result,
      'Cập nhật thông tin user thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── DELETE: chỉ ADMIN mới có quyền USER_DELETE ────────────────────────────
  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa user - Yêu cầu quyền user:delete (chỉ ADMIN)' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const result = await this.userService.delete(id);

    return ApiResponse.success(
      result,
      'Xóa user thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── FORGOT PASSWORD: public, không cần auth ───────────────────────────────
  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi mã xác nhận qua email để đặt lại mật khẩu' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Req() req: Request,
    @Body() dto: ForgotPasswordDto,
  ) {
    const result = await this.userService.forgotPassword(dto.email);

    return ApiResponse.success(
      result,
      'Gửi mã xác nhận thành công',
      HttpStatus.OK,
      req.url,
    );
  }

  // ─── RESET PASSWORD: public, không cần auth ────────────────────────────────
  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng mã xác nhận (OTP)' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req: Request,
    @Body() dto: ResetPasswordDto,
  ) {
    const result = await this.userService.resetPassword(
      dto.email,
      dto.otp,
      dto.newPassword,
    );

    return ApiResponse.success(
      result,
      'Đặt lại mật khẩu thành công',
      HttpStatus.OK,
      req.url,
    );
  }
}
