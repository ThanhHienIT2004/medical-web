import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegimenService } from './regimen.service';
import { CreateRegimenDto } from './dto/regimen.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Regimens')
@Controller('regimens')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class RegimenController {
  constructor(private readonly regimenService: RegimenService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.REGIMEN_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách tất cả phác đồ' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.regimenService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.REGIMEN_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết phác đồ' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.regimenService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.REGIMEN_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo phác đồ mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateRegimenDto) {
    const result = await this.regimenService.create(dto);
    return ApiResponse.success(result, 'Tạo phác đồ thành công', HttpStatus.CREATED, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.REGIMEN_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa phác đồ' })
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const result = await this.regimenService.delete(id);
    return ApiResponse.success(result, 'Xóa phác đồ thành công', HttpStatus.OK, req.url);
  }
}
