import { Module } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsResolver } from './medications.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MedicationsResolver, MedicationsService, PrismaService],
})
export class MedicationsModule {}
