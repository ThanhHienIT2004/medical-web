import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Req,
  UseFilters,
  UseInterceptors,
  } from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Upload')
@Controller('api/upload')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class UploadController {
  @Post()
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
