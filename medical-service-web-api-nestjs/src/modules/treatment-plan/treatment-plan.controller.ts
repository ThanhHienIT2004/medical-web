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
import { TreatmentPlanService } from './treatment-plan.service';
import { CreateTreatmentPlanDto, UpdateTreatmentPlanDto } from './dto/treatment-plan.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Treatment Plans')
@Controller('treatment-plans')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class TreatmentPlanController {
  constructor(private readonly planService: TreatmentPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả phác đồ điều trị' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.planService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phác đồ điều trị' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.planService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phác đồ điều trị mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateTreatmentPlanDto) {
    const result = await this.planService.create(dto);
    return ApiResponse.success(result, 'Tạo phác đồ điều trị thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phác đồ điều trị' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTreatmentPlanDto,
  ) {
    const result = await this.planService.update({ ...dto, id });
    return ApiResponse.success(result, 'Cập nhật phác đồ điều trị thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phác đồ điều trị' })
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const result = await this.planService.delete(id);
    return ApiResponse.success(result, 'Xóa phác đồ điều trị thành công', HttpStatus.OK, req.url);
  }
}
