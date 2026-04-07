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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateAppointmentStatusDto, PaginationAppointmentQueryDto } from './dto/appointments.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Appointments')
@Controller('appointments')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Đặt lịch hẹn mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateAppointmentDto) {
    const result = await this.appointmentService.create(dto);
    return ApiResponse.success(result, 'Đặt lịch hẹn thành công', HttpStatus.CREATED, req.url);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả lịch hẹn' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.appointmentService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('doctor')
  @ApiOperation({ summary: 'Lịch hẹn theo bác sĩ (phân trang)' })
  @ApiQuery({ name: 'doctor_id', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  async findByDoctor(@Req() req: Request, @Query() query: PaginationAppointmentQueryDto) {
    const result = await this.appointmentService.findAllByDoctorId(
      query.doctor_id,
      query.page ?? 1,
      query.pageSize ?? 10,
    );
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Lịch hẹn theo bệnh nhân' })
  @HttpCode(HttpStatus.OK)
  async findByPatient(
    @Req() req: Request,
    @Param('patientId') patientId: string,
  ) {
    const result = await this.appointmentService.getAppointmentByPatientId(patientId);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch hẹn' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.appointmentService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch hẹn' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    const result = await this.appointmentService.update({ ...dto, appointment_id: id });
    return ApiResponse.success(result, 'Cập nhật lịch hẹn thành công', HttpStatus.OK, req.url);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch hẹn' })
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    const result = await this.appointmentService.updateStatus(id, dto.status);
    return ApiResponse.success(result, 'Cập nhật trạng thái thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lịch hẹn' })
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.appointmentService.remove(id);
    return ApiResponse.success(result ?? null, 'Xóa lịch hẹn thành công', HttpStatus.OK, req.url);
  }
}
