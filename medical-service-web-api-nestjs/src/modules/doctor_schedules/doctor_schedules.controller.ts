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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DoctorScheduleService } from './doctor_schedules.service';
import { CreateDoctorScheduleDto, WeekDateQueryDto } from './dto/doctor_schedules.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Doctor Schedules')
@Controller('doctor-schedules')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class DoctorSchedulesController {
  constructor(private readonly scheduleService: DoctorScheduleService) {}

  @Get('week')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch bác sĩ theo tuần' })
  @ApiQuery({ name: 'start_week', required: true })
  @ApiQuery({ name: 'end_week', required: true })
  @HttpCode(HttpStatus.OK)
  async getByWeekDate(@Req() req: Request, @Query() query: WeekDateQueryDto) {
    const result = await this.scheduleService.getDoctorScheduleByWeekDate(query);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('available-dates/:doctorId')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách ngày có lịch trống của bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async getAvailableDates(@Req() req: Request, @Param('doctorId') doctorId: string) {
    const result = await this.scheduleService.getAvailableScheduleDates(doctorId);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('by-date')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch bác sĩ theo ngày' })
  @ApiQuery({ name: 'doctor_id', required: true })
  @ApiQuery({ name: 'date', required: true })
  @HttpCode(HttpStatus.OK)
  async getByDate(
    @Req() req: Request,
    @Query('doctor_id') doctorId: string,
    @Query('date') date: string,
  ) {
    const result = await this.scheduleService.findSchedulesByDoctorAndDate(doctorId, date);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo lịch bác sĩ mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateDoctorScheduleDto) {
    const result = await this.scheduleService.create(dto);
    return ApiResponse.success(result, 'Tạo lịch bác sĩ thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật lịch bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: CreateDoctorScheduleDto,
  ) {
    const result = await this.scheduleService.update(id, dto);
    return ApiResponse.success(result, 'Cập nhật lịch bác sĩ thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.APPOINTMENT_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa lịch bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const result = await this.scheduleService.delete(id);
    return ApiResponse.success(result, 'Xóa lịch bác sĩ thành công', HttpStatus.OK, req.url);
  }
}
