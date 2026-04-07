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
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medications.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Medications')
@Controller('medications')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thuốc (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const result = await this.medicationsService.getMedications(
      query.page ?? 1,
      query.limit ?? 10,
    );
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm thuốc theo từ khóa' })
  @ApiQuery({ name: 'keyword', required: true })
  @HttpCode(HttpStatus.OK)
  async search(@Req() req: Request, @Query('keyword') keyword: string) {
    const result = await this.medicationsService.searchMedications(keyword);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết thuốc theo ID' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.medicationsService.getMedicationById(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thuốc mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateMedicationDto) {
    const result = await this.medicationsService.createMedication(dto);
    return ApiResponse.success(result, 'Tạo thuốc thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thuốc' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMedicationDto,
  ) {
    const result = await this.medicationsService.updateMedication(id, dto);
    return ApiResponse.success(result, 'Cập nhật thuốc thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thuốc' })
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.medicationsService.removeMedication(id);
    return ApiResponse.success(result, 'Xóa thuốc thành công', HttpStatus.OK, req.url);
  }
}
