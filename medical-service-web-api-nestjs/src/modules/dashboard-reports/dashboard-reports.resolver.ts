// dashboard-reports.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DashboardReport, CreateDashboardReportInput, UpdateDashboardReportInput, GetDashboardReportByIdInput, DeleteDashboardReportInput, GetDashboardReportByTypeInput } from './types/dashboard-reports.type';
import { DashboardReportsService } from './dashboard-reports.service';

@Resolver(() => DashboardReport)
export class DashboardReportsResolver {
  constructor(private readonly dashboardReportsService: DashboardReportsService) {}

  @Mutation(() => DashboardReport)
  createDashboardReport(@Args('input') input: CreateDashboardReportInput) {
    return this.dashboardReportsService.create(input);
  }

  @Query(() => [DashboardReport])
  findAllDashboardReports() {
    return this.dashboardReportsService.findAll();
  }

  @Query(() => DashboardReport)
  findOneDashboardReport(@Args('input') input: GetDashboardReportByIdInput) {
    return this.dashboardReportsService.findOne(input.report_id);
  }

  @Query(() => [DashboardReport])
  findDashboardReportsByType(@Args('input') input: GetDashboardReportByTypeInput) {
    return this.dashboardReportsService.findByType(input.report_type);
  }

  @Mutation(() => DashboardReport)
  updateDashboardReport(@Args('input') input: UpdateDashboardReportInput) {
    return this.dashboardReportsService.update(input.report_id, input);
  }

  @Mutation(() => Boolean)
  deleteDashboardReport(@Args('input') input: DeleteDashboardReportInput) {
    return this.dashboardReportsService.remove(input.report_id);
  }
}