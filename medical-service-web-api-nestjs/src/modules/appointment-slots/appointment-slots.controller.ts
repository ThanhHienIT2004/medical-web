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
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentSlotsService } from './appointment-slots.service';
import { CreateAppointmentSlotDto, UpdateAppointmentSlotDto } from './dto/appointment-slots.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Appointment Slots')
@Controller('appointment-slots')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class AppointmentSlotsController {
  constructor(private readonly slotsService: AppointmentSlotsService) {}

  @Get()
  @ApiOperation({ summary: 'Tất cả appointment slots' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.slotsService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết appointment slot' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.slotsService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('schedule/:scheduleId')
  @ApiOperation({ summary: 'Appointment slots theo schedule ID' })
  @HttpCode(HttpStatus.OK)
  async findBySchedule(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: string,
  ) {
    const result = await this.slotsService.findByScheduleId(scheduleId);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo appointment slot mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateAppointmentSlotDto) {
    const result = await this.slotsService.create(dto);
    return ApiResponse.success(result, 'Tạo appointment slot thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật appointment slot' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentSlotDto,
  ) {
    const result = await this.slotsService.update(id, dto);
    return ApiResponse.success(result, 'Cập nhật appointment slot thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa appointment slot' })
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const result = await this.slotsService.delete(id);
    return ApiResponse.success(result, 'Xóa appointment slot thành công', HttpStatus.OK, req.url);
  }
}
