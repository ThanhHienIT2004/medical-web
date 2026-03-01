import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { AuthService } from '../auth/auth.service';
import { CreateDoctorDto, RegisterDoctorDto, UpdateDoctorDto } from './dto/doctors.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả bác sĩ' })
  async findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bác sĩ theo ID' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo bác sĩ mới (đăng ký + tạo doctor profile)' })
  async createDoctor(@Body() dto: RegisterDoctorDto) {
    try {
      await this.authService.register(dto);
      return { success: true, message: 'Tạo bác sĩ thành công' };
    } catch (error) {
      return { success: false, message: error.message || 'Lỗi khi tạo doctor' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bác sĩ' })
  async updateDoctor(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bác sĩ' })
  async deleteDoctor(@Param('id') id: string) {
    return this.doctorsService.delete(id);
  }
}
