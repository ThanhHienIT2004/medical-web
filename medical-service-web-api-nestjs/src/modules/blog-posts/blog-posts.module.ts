// blog-posts.module.ts
import { Module } from '@nestjs/common';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BlogPostsController],
  providers: [BlogPostsService, PrismaService],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}