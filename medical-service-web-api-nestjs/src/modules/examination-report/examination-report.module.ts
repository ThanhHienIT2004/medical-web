import { Module } from '@nestjs/common';
import { ExaminationReportController } from './examination-report.controller';
import { ExaminationReportService } from './examination-report.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ExaminationReportController],
  providers: [ExaminationReportService, PrismaService],
})
export class ExaminationReportModule {}
