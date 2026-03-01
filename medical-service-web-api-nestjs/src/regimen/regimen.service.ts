import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegimenInput } from './types/regimen.type';

@Injectable()
export class RegimenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRegimenInput) {
    return this.prisma.regimen.create({ data: input });
  }

  async findAll() {
    return this.prisma.regimen.findMany();
  }

  async findOne(id: number) {
    const regimen = await this.prisma.regimen.findUnique({ where: { id } });
    if (!regimen) throw new NotFoundException('Regimen not found');
    return regimen;
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.regimen.delete({ where: { id } });
  }
}