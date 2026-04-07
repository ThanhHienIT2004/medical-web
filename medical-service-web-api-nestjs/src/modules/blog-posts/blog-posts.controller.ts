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
  Query,
  Req,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto, UpdateBlogPostDto, PaginationBlogQueryDto } from './dto/blog-posts.dto';
import { ApiResponse } from '../common/response/api-response';
import { GlobalExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Blog Posts')
@Controller('blog-posts')
@UseInterceptors(ResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách bài viết (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() query: PaginationBlogQueryDto) {
    const result = await this.blogPostsService.findAll(
      query.page ?? 1,
      query.pageSize ?? 10,
    );
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const result = await this.blogPostsService.findOne(id);
    return ApiResponse.success(result, 'OK', HttpStatus.OK, req.url);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateBlogPostDto) {
    const result = await this.blogPostsService.create(dto);
    return ApiResponse.success(result, 'Tạo bài viết thành công', HttpStatus.CREATED, req.url);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
  ) {
    const result = await this.blogPostsService.update(id, dto as any);
    return ApiResponse.success(result, 'Cập nhật bài viết thành công', HttpStatus.OK, req.url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài viết' })
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const result = await this.blogPostsService.remove(id);
    return ApiResponse.success(result, 'Xóa bài viết thành công', HttpStatus.OK, req.url);
  }
}
