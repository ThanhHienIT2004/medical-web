import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medications.dto';
import { PaginationQueryDto } from '../user/dto/user.dto';

@ApiTags('Medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thuốc (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.medicationsService.getMedications(query.page || 1, query.limit || 10);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm thuốc theo từ khóa' })
  @ApiQuery({ name: 'keyword', required: true })
  async search(@Query('keyword') keyword: string) {
    return this.medicationsService.searchMedications(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết thuốc theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.getMedicationById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thuốc mới' })
  async create(@Body() dto: CreateMedicationDto) {
    return this.medicationsService.createMedication(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thuốc' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicationDto) {
    return this.medicationsService.updateMedication(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thuốc' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.removeMedication(id);
  }
}
