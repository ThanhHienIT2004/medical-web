import type { Request } from 'express';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardReportsService } from './dashboard-reports.service';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Dashboard Reports')
@Controller('dashboard-reports')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class DashboardReportsController {
  constructor(private readonly dashboardReportsService: DashboardReportsService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DASHBOARD_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách dashboard reports' })
  @ApiQuery({ name: 'type', required: false })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request, @Query('type') type?: string) {
    const result = type
      ? await this.dashboardReportsService.findByType(type)
      : await this.dashboardReportsService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DASHBOARD_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết dashboard report' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.dashboardReportsService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }
}

