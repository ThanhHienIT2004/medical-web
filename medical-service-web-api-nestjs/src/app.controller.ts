import type { Request } from 'express';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from './modules/common/response/api-response';
import { GlobalExceptionFilter } from './modules/common/filters/http-exception.filter';
import { ResponseInterceptor } from './modules/common/interceptors/response.interceptor';

@ApiTags('App')
@Controller()
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello' })
  @HttpCode(HttpStatus.OK)
  getHello(@Req() req: Request) {
    const result = this.appService.getHello();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @HttpCode(HttpStatus.OK)
  getHealth(@Req() req: Request) {
    return ApiResponse.success({ status: 'ok' }, 'OK', HttpStatus.OK, req.url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  @ApiOperation({ summary: 'Protected route' })
  @HttpCode(HttpStatus.OK)
  getProtected(@Req() req: Request) {
    return ApiResponse.success({ message: 'This is a protected route' }, 'OK', HttpStatus.OK, req.url);
  }
}
