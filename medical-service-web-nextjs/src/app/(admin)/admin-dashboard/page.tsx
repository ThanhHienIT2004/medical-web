"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/libs/api/apiClient";
import type { DashboardReport } from "@/types/dashboardReports";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CalendarClock, Layers, RefreshCw } from "lucide-react";

type MetricCard = {
  key: string;
  label: string;
  value: string | number;
};

const CHART_COLORS = ["#2563eb", "#9333ea", "#16a34a", "#ea580c", "#dc2626", "#0891b2"];

function asDate(value: string | Date | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateLabel(value: string | Date | undefined): string {
  const date = asDate(value);
  return date ? date.toLocaleDateString("vi-VN") : "N/A";
}

function toDateTimeLabel(value: string | Date | undefined): string {
  const date = asDate(value);
  return date ? date.toLocaleString("vi-VN") : "N/A";
}

function parseNumericEntries(data: unknown): MetricCard[] {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return [];
  }

  return Object.entries(data as Record<string, unknown>)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .slice(0, 4)
    .map(([key, value]) => ({
      key,
      label: key.replaceAll("_", " "),
      value,
    }));
}

export default function ManagementPage() {
  const [reports, setReports] = useState<DashboardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<DashboardReport[]>("/dashboard-reports");
      setReports(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải dashboard reports"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const latest = useMemo(() => reports[0] ?? null, [reports]);

  const totalReports = reports.length;

  const uniqueTypes = useMemo(() => {
    return new Set(reports.map((report) => report.report_type)).size;
  }, [reports]);

  const reportsToday = useMemo(() => {
    const today = new Date().toDateString();
    return reports.filter((report) => asDate(report.created_at)?.toDateString() === today).length;
  }, [reports]);

  const typeDistribution = useMemo(() => {
    const grouped = new Map<string, number>();
    reports.forEach((report) => {
      grouped.set(report.report_type, (grouped.get(report.report_type) ?? 0) + 1);
    });
    return Array.from(grouped.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [reports]);

  const timeline = useMemo(() => {
    const grouped = new Map<string, number>();
    reports.forEach((report) => {
      const label = toDateLabel(report.generated_at);
      grouped.set(label, (grouped.get(label) ?? 0) + 1);
    });
    return Array.from(grouped.entries()).map(([date, count]) => ({ date, count }));
  }, [reports]);

  const dataMetrics = useMemo(() => parseNumericEntries(latest?.data), [latest]);

  const kpiCards: MetricCard[] = [
    { key: "total", label: "Tong report", value: totalReports },
    { key: "type", label: "Loai report", value: uniqueTypes },
    { key: "today", label: "Tao hom nay", value: reportsToday },
    {
      key: "latest",
      label: "Lan tao moi nhat",
      value: latest ? toDateTimeLabel(latest.created_at) : "N/A",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Theo doi nhanh tinh hinh he thong va bao cao moi nhat.</p>
        </div>
        <button
          type="button"
          onClick={fetchReports}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          <RefreshCw size={16} />
          Lam moi
        </button>
      </div>

      {loading ? (
        <p className="rounded-xl bg-white p-4 shadow">Dang tai du lieu dashboard...</p>
      ) : error ? (
        <p className="rounded-xl bg-red-50 p-4 text-red-600">Loi: {error.message}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card, idx) => (
              <div key={card.key} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  {idx === 0 && <Layers size={16} />}
                  {idx === 1 && <Activity size={16} />}
                  {idx === 2 && <CalendarClock size={16} />}
                  {idx === 3 && <RefreshCw size={16} />}
                  <span className="text-sm">{card.label}</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{card.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-3 text-base font-semibold">So luong report theo loai</h2>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-3 text-base font-semibold">Xu huong report theo ngay</h2>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#9333ea" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
              <h2 className="mb-3 text-base font-semibold">Danh sach report gan nhat</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="px-3 py-2">Report ID</th>
                      <th className="px-3 py-2">Loai</th>
                      <th className="px-3 py-2">Generated at</th>
                      <th className="px-3 py-2">Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 8).map((report) => (
                      <tr key={report.report_id} className="border-t border-gray-100">
                        <td className="px-3 py-2 font-mono text-xs">{report.report_id}</td>
                        <td className="px-3 py-2">{report.report_type}</td>
                        <td className="px-3 py-2">{toDateTimeLabel(report.generated_at)}</td>
                        <td className="px-3 py-2">{toDateTimeLabel(report.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-3 text-base font-semibold">Metric trong report moi nhat</h2>
              {dataMetrics.length > 0 ? (
                <>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataMetrics}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={72}
                        >
                          {dataMetrics.map((item, index) => (
                            <Cell key={item.key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Khong co metric dang so trong du lieu report moi nhat.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}