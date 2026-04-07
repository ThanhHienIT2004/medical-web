// documents.module.ts
import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DocumentsResolver, DocumentsService, PrismaService],
  exports: [DocumentsService],
})
export class DocumentsModule {}