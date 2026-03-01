import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `uploads/${file.filename}`,
    };
  }
}
