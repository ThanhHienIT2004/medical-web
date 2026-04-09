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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

type CreateDocumentDto = {
  title: string;
  file_url: string;
  category: string;
  uploaded_by_id: string;
};

type UpdateDocumentDto = Partial<Omit<CreateDocumentDto, 'uploaded_by_id'>> & {
  uploaded_by_id?: string;
};

@ApiTags('Documents')
@Controller('documents')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Danh sách tài liệu' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const result = await this.documentsService.findAll();
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_READ)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chi tiết tài liệu' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.documentsService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo metadata tài liệu' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateDocumentDto) {
    const result = await this.documentsService.create(dto as any);
    return ApiResponse.success(result, 'Tạo tài liệu thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật tài liệu' })
  @HttpCode(HttpStatus.OK)
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    const result = await this.documentsService.update(id, { document_id: id, ...dto } as any);
    return ApiResponse.success(result, 'Cập nhật tài liệu thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tài liệu' })
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.documentsService.remove(id);
    return ApiResponse.success(result, 'Xóa tài liệu thành công', HttpStatus.OK, req.url);
  }
}

