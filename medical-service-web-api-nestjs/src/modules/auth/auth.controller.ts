import type { Request } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as ApiSwaggerResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiSwaggerResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiSwaggerResponse({ status: 400, description: 'Email đã tồn tại' })
  async register(@Req() req: Request, @Body() userData: RegisterDto) {
    const result = await this.authService.register(userData);
    return ApiResponse.success(result, 'Đăng ký thành công', HttpStatus.CREATED, req.url);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiSwaggerResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiSwaggerResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  async login(@Req() req: Request, @Body() userData: LoginDto) {
    const result = await this.authService.login(userData);
    return ApiResponse.success(result, 'Đăng nhập thành công', HttpStatus.OK, req.url);
  }
}
