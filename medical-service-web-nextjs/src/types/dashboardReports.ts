export type DashboardReport = {
  report_id: string;
  report_type: string;
  generated_at: string | Date;
  data: unknown;
  created_at: string | Date;
};

