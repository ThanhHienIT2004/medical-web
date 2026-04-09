import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  } from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';

@ApiTags('Upload')
@Controller('api/upload')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class UploadController {
  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.DOCUMENT_CREATE)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Upload 1 file' })
  @HttpCode(HttpStatus.CREATED)
  uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const result = {
      url: `uploads/${file.filename}`,
    };
    return ApiResponse.success(result, 'Upload thành công', HttpStatus.CREATED, req.url);
  }
}
