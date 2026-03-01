import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto, UpdateBlogPostDto, PaginationBlogQueryDto } from './dto/blog-posts.dto';

@ApiTags('Blog Posts')
@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách bài viết (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findAll(@Query() query: PaginationBlogQueryDto) {
    return this.blogPostsService.findAll(query.page || 1, query.pageSize || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  async create(@Body() dto: CreateBlogPostDto) {
    return this.blogPostsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogPostDto) {
    return this.blogPostsService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài viết' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostsService.remove(id);
  }
}
