import { Module } from '@nestjs/common';
import { RegimenService } from './regimen.service';
import { RegimenResolver } from './regimen.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RegimenResolver, RegimenService, PrismaService],
})
export class RegimenModule {}
