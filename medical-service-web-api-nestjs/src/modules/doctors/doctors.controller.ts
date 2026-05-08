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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { AuthService } from '../auth/auth.service';
import { RegisterDoctorDto, UpdateDoctorDto } from './dto/doctors.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { Role } from '../role/role.enum';

@ApiTags('Doctors')
@Controller('doctors')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.doctorsService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCTOR_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết bác sĩ theo ID' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.doctorsService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCTOR_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bác sĩ mới (đăng ký + tạo doctor profile)' })
  @HttpCode(HttpStatus.CREATED)
  async createDoctor(@Req() req: Request, @Body() dto: RegisterDoctorDto) {
    const result = await this.authService.register(dto, Role.DOCTOR);
    return ApiResponse.success(result, 'Tạo bác sĩ thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCTOR_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async updateDoctor(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    const result = await this.doctorsService.update(id, dto);
    return ApiResponse.success(result, 'Cập nhật bác sĩ thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCTOR_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bác sĩ' })
  @HttpCode(HttpStatus.OK)
  async deleteDoctor(@Req() req: Request, @Param('id') id: string) {
    const result = await this.doctorsService.delete(id);
    return ApiResponse.success(result, 'Xóa bác sĩ thành công', HttpStatus.OK, req.url);
  }
}
