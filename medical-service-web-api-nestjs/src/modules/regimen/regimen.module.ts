import { Module } from '@nestjs/common';
import { RegimenController } from './regimen.controller';
import { RegimenService } from './regimen.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RegimenController],
  providers: [RegimenService, PrismaService],
})
export class RegimenModule {}
