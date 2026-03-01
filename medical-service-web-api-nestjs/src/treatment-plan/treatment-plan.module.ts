import { Module } from '@nestjs/common';
import { TreatmentPlanService } from './treatment-plan.service';
import { TreatmentPlanResolver } from './treatment-plan.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TreatmentPlanResolver, TreatmentPlanService, PrismaService],
  exports: [TreatmentPlanService],
})
export class TreatmentPlanModule {}
