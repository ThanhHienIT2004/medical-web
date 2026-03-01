import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentSlotsService } from './appointment-slots.service';
import { CreateAppointmentSlotDto, UpdateAppointmentSlotDto } from './dto/appointment-slots.dto';

@ApiTags('Appointment Slots')
@Controller('appointment-slots')
export class AppointmentSlotsController {
  constructor(private readonly slotsService: AppointmentSlotsService) {}

  @Get()
  @ApiOperation({ summary: 'Tất cả appointment slots' })
  async findAll() {
    return this.slotsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết appointment slot' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.slotsService.findOne(id);
  }

  @Get('schedule/:scheduleId')
  @ApiOperation({ summary: 'Appointment slots theo schedule ID' })
  async findBySchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    return this.slotsService.findByScheduleId(scheduleId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo appointment slot mới' })
  async create(@Body() dto: CreateAppointmentSlotDto) {
    return this.slotsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật appointment slot' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentSlotDto) {
    return this.slotsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa appointment slot' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.slotsService.delete(id);
  }
}
