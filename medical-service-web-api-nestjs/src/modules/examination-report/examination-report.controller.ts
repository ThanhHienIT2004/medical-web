import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExaminationReportService } from './examination-report.service';
import { CreateExaminationReportDto, MedicalExaminationDto } from './dto/examination-report.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Examination Reports')
@Controller('examination-reports')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class ExaminationReportController {
  constructor(private readonly reportService: ExaminationReportService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EXAMINATION_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách tất cả báo cáo khám bệnh' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.reportService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EXAMINATION_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết báo cáo khám bệnh' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.reportService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EXAMINATION_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo báo cáo khám bệnh' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateExaminationReportDto) {
    const result = await this.reportService.create(dto);
    return ApiResponse.success(result, 'Tạo báo cáo khám bệnh thành công', HttpStatus.CREATED, req.url);
  }

  @Post('medical-examination')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EXAMINATION_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo trọn bộ khám bệnh (report + regimen + treatment plan)' })
  @HttpCode(HttpStatus.CREATED)
  async makeMedicalExamination(@Req() req: Request, @Body() dto: MedicalExaminationDto) {
    const result = await this.reportService.make(dto);
    return ApiResponse.success(result, 'Tạo khám bệnh thành công', HttpStatus.CREATED, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.EXAMINATION_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa báo cáo khám bệnh' })
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const result = await this.reportService.delete(id);
    return ApiResponse.success(result, 'Xóa báo cáo khám bệnh thành công', HttpStatus.OK, req.url);
  }
}
