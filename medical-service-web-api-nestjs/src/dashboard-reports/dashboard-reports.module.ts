// dashboard-reports.module.ts
import { Module } from '@nestjs/common';
import { DashboardReportsService } from './dashboard-reports.service';
import { DashboardReportsResolver } from './dashboard-reports.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DashboardReportsResolver, DashboardReportsService, PrismaService],
  exports: [DashboardReportsService],
})
export class DashboardReportsModule {}