// blog-posts.module.ts
import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsResolver } from './blog-posts.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BlogPostsResolver, BlogPostsService, PrismaService],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}