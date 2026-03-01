// documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentInput, UpdateDocumentInput } from './types/documents.type';
import { Document as PrismaDocument } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDocumentInput): Promise<PrismaDocument> {
    return this.prisma.document.create({
      data: { ...input },
    });
  }

  async findAll(): Promise<PrismaDocument[]> {
    return this.prisma.document.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<PrismaDocument> {
    const document = await this.prisma.document.findUnique({
      where: { document_id: id },
    });
    if (!document) {
      throw new NotFoundException(`Document #${id} not found`);
    }
    return document;
  }

  async update(id: number, input: UpdateDocumentInput): Promise<PrismaDocument> {
    await this.findOne(id); // ensure exists
    return this.prisma.document.update({
      where: { document_id: id },
      data: { ...input, updated_at: new Date() },
    });
  }

  async remove(id: number): Promise<PrismaDocument> {
    await this.findOne(id); // ensure exists
    return this.prisma.document.delete({
      where: { document_id: id },
    });
  }
}