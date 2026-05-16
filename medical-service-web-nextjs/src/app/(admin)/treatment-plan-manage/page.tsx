"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import type { ActionAdminTable } from "@/app/(admin)/_components/table/AdminTable";
import AdminForm, { type AdminFormProps } from "@/app/(admin)/_components/forms/AdminForm";
import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";
import ConfirmationDialog from "@/app/(admin)/_components/dialog/ConfirmationDialog";
import { apiClient } from "@/libs/api/apiClient";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";
import { useSession } from "next-auth/react";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

import type { TreatmentPlan, CreateTreatmentPlanInput, UpdateTreatmentPlanInput } from "@/types/treatment_plan";

export default function TreatmentPlanManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "treatment-plans");

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<TreatmentPlan[]>("/treatment-plans");
      setPlans(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải phác đồ điều trị"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return plans;
    return plans.filter((p) => {
      const parts = [p.id, p.name, p.notes ?? ""].join(" ").toLowerCase();
      return parts.includes(term);
    });
  }, [plans, searchTerm]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const selected = useMemo(
    () => (selectedId ? plans.find((p) => p.id === selectedId) ?? null : null),
    [plans, selectedId]
  );

  const createFields: AdminFormProps<CreateTreatmentPlanInput>["fields"] = [
    { label: "Tên", key: "name", type: "text", required: true },
    { label: "Ngày chẩn đoán HIV (ISO)", key: "hiv_diagnosis_date", type: "text" },
    { label: "Ngày bắt đầu (ISO)", key: "start_date", type: "text", required: true },
    { label: "Ngày kết thúc (ISO)", key: "end_date", type: "text" },
    { label: "Ghi chú", key: "notes", type: "text" },
  ];

  const updateFields: AdminFormProps<UpdateTreatmentPlanInput>["fields"] = [
    { label: "Tên", key: "name", type: "text" },
    { label: "Ngày chẩn đoán HIV (ISO)", key: "hiv_diagnosis_date", type: "text" },
    { label: "Ngày bắt đầu (ISO)", key: "start_date", type: "text" },
    { label: "Ngày kết thúc (ISO)", key: "end_date", type: "text" },
    { label: "Ghi chú", key: "notes", type: "text" },
  ];

  const renderForm = () => {
    if (selectedAction === "create") {
      return (
        <AdminForm<CreateTreatmentPlanInput>
          title="Tạo phác đồ điều trị"
          submitLabel="Tạo"
          fields={createFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              await apiClient("/treatment-plans", { method: "POST", body: data });
              toast.success("Tạo phác đồ thành công", { toastId: "admin-create-plan" });
              await fetchPlans();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo thất bại: ${msg}`, { toastId: "admin-create-plan-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "update" && selected) {
      const initial: UpdateTreatmentPlanInput = {
        name: selected.name,
        hiv_diagnosis_date: selected.hiv_diagnosis_date ? String(selected.hiv_diagnosis_date) : undefined,
        start_date: selected.start_date ? String(selected.start_date) : undefined,
        end_date: selected.end_date ? String(selected.end_date) : undefined,
        notes: selected.notes,
      };

      return (
        <AdminForm<UpdateTreatmentPlanInput>
          title={`Cập nhật phác đồ #${selected.id}`}
          submitLabel="Lưu"
          initialData={initial}
          fields={updateFields}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              await apiClient(`/treatment-plans/${selected.id}`, { method: "PATCH", body: data });
              toast.success("Cập nhật thành công", { toastId: "admin-update-plan" });
              await fetchPlans();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Cập nhật thất bại: ${msg}`, { toastId: "admin-update-plan-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selected) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xác nhận xóa phác đồ điều trị"
          message={`Bạn có chắc muốn xóa phác đồ ${selected.id} không?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/treatment-plans/${selected.id}`, { method: "DELETE" });
              toast.success("Xóa phác đồ thành công", { toastId: "admin-delete-plan" });
              await fetchPlans();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Xóa thất bại: ${msg}`, { toastId: "admin-delete-plan-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "view" && selected) {
      const fields: ViewField[] = [
        { label: "ID", key: "id" },
        { label: "Tên", key: "name" },
        { label: "Bắt đầu", key: "start_date" },
        { label: "Kết thúc", key: "end_date" },
      ];
      return <ViewModal isOpen={true} item={selected} title={`Chi tiết phác đồ ${selected.id}`} fields={fields} onClose={() => setSelectedAction("view")} />;
    }

    return null;
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý phác đồ điều trị</h1>
      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo id/tên/ghi chú...",
          onSearch: (t) => {
            setSearchTerm(t);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "id", type: "text" as const },
            { label: "Tên", key: "name", type: "text" as const },
            { label: "Bắt đầu", key: "start_date", type: "date" as const },
            { label: "Kết thúc", key: "end_date", type: "date" as const },
          ],
          items: paged,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as string) },
          rowOperations: buildCrudRowOperations<{ id: string }, string>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
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



