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
import { PatientService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patients.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Patients')
@Controller('patients')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PATIENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách tất cả bệnh nhân' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.patientService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PATIENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết bệnh nhân theo ID' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.patientService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PATIENT_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bệnh nhân mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreatePatientDto) {
    const result = await this.patientService.create(dto);
    return ApiResponse.success(result, 'Tạo bệnh nhân thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PATIENT_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bệnh nhân' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    const result = await this.patientService.update(id, { ...dto, patient_id: id });
    return ApiResponse.success(result, 'Cập nhật bệnh nhân thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.PATIENT_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bệnh nhân' })
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.patientService.remove(id);
    return ApiResponse.success(result, 'Xóa bệnh nhân thành công', HttpStatus.OK, req.url);
  }
}
