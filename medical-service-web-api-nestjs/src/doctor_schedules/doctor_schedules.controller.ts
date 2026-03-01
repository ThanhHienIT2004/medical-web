import { Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DoctorScheduleService } from './doctor_schedules.service';
import { CreateDoctorScheduleDto, WeekDateQueryDto } from './dto/doctor_schedules.dto';

@ApiTags('Doctor Schedules')
@Controller('doctor-schedules')
export class DoctorSchedulesController {
  constructor(private readonly scheduleService: DoctorScheduleService) {}

  @Get('week')
  @ApiOperation({ summary: 'Lấy lịch bác sĩ theo tuần' })
  @ApiQuery({ name: 'start_week', required: true })
  @ApiQuery({ name: 'end_week', required: true })
  async getByWeekDate(@Query() query: WeekDateQueryDto) {
    return this.scheduleService.getDoctorScheduleByWeekDate(query);
  }

  @Get('available-dates/:doctorId')
  @ApiOperation({ summary: 'Lấy danh sách ngày có lịch trống của bác sĩ' })
  async getAvailableDates(@Param('doctorId') doctorId: string) {
    return this.scheduleService.getAvailableScheduleDates(doctorId);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Lấy lịch bác sĩ theo ngày' })
  @ApiQuery({ name: 'doctor_id', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getByDate(
    @Query('doctor_id') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.scheduleService.findSchedulesByDoctorAndDate(doctorId, date);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo lịch bác sĩ mới' })
  async create(@Body() dto: CreateDoctorScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lịch bác sĩ' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDoctorScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lịch bác sĩ' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.delete(id);
  }
}
