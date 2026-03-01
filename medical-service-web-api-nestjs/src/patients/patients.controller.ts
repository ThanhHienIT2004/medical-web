import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PatientService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patients.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả bệnh nhân' })
  async findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bệnh nhân theo ID' })
  async findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo bệnh nhân mới' })
  async create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bệnh nhân' })
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, { ...dto, patient_id: id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bệnh nhân' })
  async remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
}
