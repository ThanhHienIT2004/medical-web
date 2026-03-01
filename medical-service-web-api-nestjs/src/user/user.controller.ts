import { Controller, Get, Patch, Delete, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/auth.decorator';
import { User as PrismaUser } from '@prisma/client';
import { UpdateUserDto, ForgotPasswordDto, ResetPasswordDto, PaginationQueryDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách users (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(@Query() query: PaginationQueryDto) {
    return this.userService.getAllUsers({
      page: query.page || 1,
      limit: query.limit || 10,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy user theo ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Lấy user theo email' })
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  async updateUser(@Param('id') id: string, @Body() input: UpdateUserDto) {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa user' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi mã xác nhận qua email để đặt lại mật khẩu' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu bằng mã xác nhận (OTP)' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }
}
