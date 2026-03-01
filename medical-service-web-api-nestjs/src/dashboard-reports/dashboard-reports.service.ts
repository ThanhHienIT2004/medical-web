// dashboard-reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDashboardReportInput, UpdateDashboardReportInput } from './types/dashboard-reports.type';
import { DashboardReport as PrismaDashboardReport } from '@prisma/client';

@Injectable()
export class DashboardReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDashboardReportInput): Promise<PrismaDashboardReport> {
    return this.prisma.dashboardReport.create({
      data: { ...input },
    });
  }

  async findAll(): Promise<PrismaDashboardReport[]> {
    return this.prisma.dashboardReport.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<PrismaDashboardReport> {
    const report = await this.prisma.dashboardReport.findUnique({
      where: { report_id: id },
    });
    if (!report) {
      throw new NotFoundException(`Dashboard report #${id} not found`);
    }
    return report;
  }

  async findByType(reportType: string): Promise<PrismaDashboardReport[]> {
    return this.prisma.dashboardReport.findMany({
      where: { report_type: reportType },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: number, input: UpdateDashboardReportInput): Promise<PrismaDashboardReport> {
    await this.findOne(id); // ensure exists
    return this.prisma.dashboardReport.update({
      where: { report_id: id },
      data: { ...input },
    });
  }

  async remove(id: number): Promise<PrismaDashboardReport> {
    await this.findOne(id); // ensure exists
    return this.prisma.dashboardReport.delete({
      where: { report_id: id },
    });
  }
}