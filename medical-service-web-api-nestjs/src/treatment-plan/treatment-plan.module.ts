import { Module } from '@nestjs/common';
import { TreatmentPlanController } from './treatment-plan.controller';
import { TreatmentPlanService } from './treatment-plan.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService, PrismaService],
  exports: [TreatmentPlanService],
})
export class TreatmentPlanModule {}
