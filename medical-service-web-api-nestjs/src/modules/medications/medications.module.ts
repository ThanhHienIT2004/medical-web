import { Module } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MedicationsController],
  providers: [MedicationsService, PrismaService],
})
export class MedicationsModule {}
