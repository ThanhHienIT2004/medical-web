"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import type { ActionAdminTable } from "@/app/(admin)/_components/table/AdminTable";
import AdminForm, { type AdminFormProps } from "@/app/(admin)/_components/forms/AdminForm";
import ConfirmationDialog from "@/app/(admin)/_components/dialogs/ConfirmationDialog";
import { apiClient } from "@/libs/api/apiClient";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/table/tableCrud";
import { useSession } from "next-auth/react";
import { getCrudAccess } from "@/app/(admin)/_libs/auth/permissions";

import type { ExaminationReport, CreateExaminationReportInput } from "@/types/examination_report";

type ReportCreateForm = Omit<CreateExaminationReportInput, "is_HIV"> & {
  is_HIV: number; // 1/0
};

export default function ExaminationReportManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [reports, setReports] = useState<ExaminationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "examinations");

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<ExaminationReport[]>("/examination-reports");
      setReports(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải báo cáo khám"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reports;
    return reports.filter((r) => {
      const parts = [r.id, r.name, r.doctor_id, r.regimen_id, r.treatment_plan_id ?? ""]
        .join(" ")
        .toLowerCase();
      return parts.includes(term);
    });
  }, [reports, searchTerm]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const selected = useMemo(
    () => (selectedId ? reports.find((r) => r.id === selectedId) ?? null : null),
    [reports, selectedId]
  );

  const createFields: AdminFormProps<ReportCreateForm>["fields"] = [
    { label: "Tên", key: "name", type: "text", required: true },
    { label: "Doctor ID", key: "doctor_id", type: "text", required: true },
    { label: "Đánh giá rủi ro", key: "risk_assessment", type: "text", required: true },
    {
      label: "HIV?",
      key: "is_HIV",
      type: "select",
      required: true,
      options: [
        { label: "Không", value: 0 },
        { label: "Có", value: 1 },
      ],
    },
    { label: "File xét nghiệm HIV", key: "HIV_test_file", type: "text", required: true },
    { label: "Regimen ID", key: "regimen_id", type: "text", required: true },
    { label: "Treatment plan ID (optional)", key: "treatment_plan_id", type: "text" },
  ];

  const renderForm = () => {
    if (selectedAction === "create") {
      return (
        <AdminForm<ReportCreateForm>
          title="Tạo báo cáo khám"
          submitLabel="Tạo"
          fields={createFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              const payload: CreateExaminationReportInput = {
                name: data.name,
                doctor_id: data.doctor_id,
                risk_assessment: data.risk_assessment,
                is_HIV: Boolean(data.is_HIV),
                HIV_test_file: data.HIV_test_file,
                regimen_id: data.regimen_id,
                treatment_plan_id: data.treatment_plan_id || undefined,
              };
              await apiClient("/examination-reports", { method: "POST", body: payload });
              toast.success("Tạo báo cáo thành công", { toastId: "admin-create-report" });
              await fetchReports();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo thất bại: ${msg}`, { toastId: "admin-create-report-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selected) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xác nhận xóa báo cáo khám"
          message={`Bạn có chắc muốn xóa báo cáo ${selected.id} không?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/examination-reports/${selected.id}`, { method: "DELETE" });
              toast.success("Xóa báo cáo thành công", { toastId: "admin-delete-report" });
              await fetchReports();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Xóa thất bại: ${msg}`, { toastId: "admin-delete-report-error" });
            }
          }}
        />
      );
    }

    // No update endpoint for report in BE (yet)
    return null;
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý báo cáo khám bệnh</h1>
      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo id/tên/doctor_id/regimen_id...",
          onSearch: (t) => {
            setSearchTerm(t);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "id", type: "text" as const },
            { label: "Tên", key: "name", type: "text" as const },
            { label: "Doctor", key: "doctor_id", type: "text" as const },
            { label: "Regimen", key: "regimen_id", type: "text" as const },
            { label: "HIV", key: "is_HIV", type: "text" as const },
            { label: "Tạo lúc", key: "created_at", type: "date" as const },
          ],
          items: paged,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as string) },
          rowOperations: buildCrudRowOperations<{ id: string }, string>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: false, delete: access.canDelete },
          }),
        }}
        paginationProps={{
          state: { page, limit, total },
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
        }}
      />
    </div>
  );
}

