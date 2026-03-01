import { Module } from '@nestjs/common';
import { ExaminationReportService } from './examination-report.service';
import { ExaminationReportResolver } from './examination-report.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ExaminationReportResolver, ExaminationReportService, PrismaService],
})
export class ExaminationReportModule {}
