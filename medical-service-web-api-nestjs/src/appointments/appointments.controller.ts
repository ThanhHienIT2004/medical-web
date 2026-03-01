import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateAppointmentStatusDto, PaginationAppointmentQueryDto } from './dto/appointments.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Đặt lịch hẹn mới' })
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả lịch hẹn' })
  async findAll() {
    return this.appointmentService.findAll();
  }

  @Get('doctor')
  @ApiOperation({ summary: 'Lịch hẹn theo bác sĩ (phân trang)' })
  @ApiQuery({ name: 'doctor_id', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findByDoctor(@Query() query: PaginationAppointmentQueryDto) {
    return this.appointmentService.findAllByDoctorId(
      query.doctor_id,
      query.page || 1,
      query.pageSize || 10,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Lịch hẹn theo bệnh nhân' })
  async findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentService.getAppointmentByPatientId(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch hẹn' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch hẹn' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update({ ...dto, appointment_id: id });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch hẹn' })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentStatusDto) {
    return this.appointmentService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lịch hẹn' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentService.remove(id);
    return { success: true };
  }
}
