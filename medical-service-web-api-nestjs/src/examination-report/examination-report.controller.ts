import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExaminationReportService } from './examination-report.service';
import { CreateExaminationReportDto, MedicalExaminationDto } from './dto/examination-report.dto';

@ApiTags('Examination Reports')
@Controller('examination-reports')
export class ExaminationReportController {
  constructor(private readonly reportService: ExaminationReportService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả báo cáo khám bệnh' })
  async findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết báo cáo khám bệnh' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo báo cáo khám bệnh' })
  async create(@Body() dto: CreateExaminationReportDto) {
    return this.reportService.create(dto);
  }

  @Post('medical-examination')
  @ApiOperation({ summary: 'Tạo trọn bộ khám bệnh (report + regimen + treatment plan)' })
  async makeMedicalExamination(@Body() dto: MedicalExaminationDto) {
    return this.reportService.make(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa báo cáo khám bệnh' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.delete(id);
  }
}
