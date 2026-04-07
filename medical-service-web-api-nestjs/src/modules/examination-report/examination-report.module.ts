import { Module } from '@nestjs/common';
import { ExaminationReportController } from './examination-report.controller';
import { ExaminationReportService } from './examination-report.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExaminationReportController],
  providers: [ExaminationReportService, PrismaService],
})
export class ExaminationReportModule {}
