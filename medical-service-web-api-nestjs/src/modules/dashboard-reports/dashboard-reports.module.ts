// dashboard-reports.module.ts
import { Module } from '@nestjs/common';
import { DashboardReportsService } from './dashboard-reports.service';
import { DashboardReportsResolver } from './dashboard-reports.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardReportsController } from './dashboard-reports.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DashboardReportsController],
  providers: [DashboardReportsResolver, DashboardReportsService, PrismaService],
  exports: [DashboardReportsService],
})
export class DashboardReportsModule {}