"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

import AdminTableLayout from "@/app/(admin)/_components/table/AdminTableLayout";
import type { ActionAdminTable } from "@/app/(admin)/_components/table/AdminTable";
import AdminForm from "@/app/(admin)/_components/forms/AdminForm";
import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";
import ConfirmationDialog from "@/app/(admin)/_components/dialog/ConfirmationDialog";
import { apiClient } from "@/libs/api/apiClient";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";
import { useSession } from "next-auth/react";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

import type { Regimen, CreateRegimenInput } from "@/types/regimen";

type RegimenCreateForm = Omit<CreateRegimenInput, "medication_list" | "is_default"> & {
  medication_list: string; // CSV
  is_default: number; // 1/0
};

export default function RegimenManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [regimens, setRegimens] = useState<Regimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "regimens");

  const fetchRegimens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<Regimen[]>("/regimens");
      setRegimens(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải phác đồ thuốc"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegimens();
  }, [fetchRegimens]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return regimens;
    return regimens.filter((r) => {
      const parts = [
        r.id,
        r.care_stage,
        r.regimen_type,
        r.user_guide,
        r.medication_list?.join(",") ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return parts.includes(term);
    });
  }, [regimens, searchTerm]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const selected = useMemo(
    () => (selectedId ? regimens.find((r) => r.id === selectedId) ?? null : null),
    [regimens, selectedId]
  );

  const renderForm = () => {
    if (selectedAction === "create") {
      return (
        <AdminForm<RegimenCreateForm>
          title="Tạo phác đồ thuốc"
          submitLabel="Tạo"
          fields={[
            { label: "Giai đoạn (PrEP/PEP/ARV)", key: "care_stage", type: "text", required: true },
            { label: "Loại (STANDARD/CUSTOM)", key: "regimen_type", type: "text", required: true },
            { label: "Danh sách thuốc (CSV)", key: "medication_list", type: "text", required: true },
            { label: "HDSD", key: "user_guide", type: "text", required: true },
            {
              label: "Mặc định?",
              key: "is_default",
              type: "select",
              required: true,
              options: [
                { label: "Không", value: 0 },
                { label: "Có", value: 1 },
              ],
            },
          ]}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              const payload: CreateRegimenInput = {
                care_stage: data.care_stage,
                regimen_type: data.regimen_type,
                medication_list: data.medication_list
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                user_guide: data.user_guide,
                is_default: Boolean(data.is_default),
              };
              await apiClient("/regimens", { method: "POST", body: payload });
              toast.success("Tạo phác đồ thành công", { toastId: "admin-create-regimen" });
              await fetchRegimens();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo thất bại: ${msg}`, { toastId: "admin-create-regimen-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selected) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xác nhận xóa phác đồ"
          message={`Bạn có chắc muốn xóa phác đồ ${selected.id} không?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/regimens/${selected.id}`, { method: "DELETE" });
              toast.success("Xóa phác đồ thành công", { toastId: "admin-delete-regimen" });
              await fetchRegimens();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Xóa thất bại: ${msg}`, { toastId: "admin-delete-regimen-error" });
            }
          }}
        />
      );
    }
    if (selectedAction === "view" && selected) {
      const fields: ViewField[] = [
        { label: "ID", key: "id" },
        { label: "Giai đoạn", key: "care_stage" },
        { label: "Loại", key: "regimen_type" },
        { label: "Mặc định", key: "is_default" },
      ];
      return <ViewModal isOpen={true} item={selected} title={`Chi tiết phác đồ ${selected.id}`} fields={fields} onClose={() => setSelectedAction("view")} />;
    }

    // No update endpoint in BE for regimens (yet)
    return null;
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý phác đồ thuốc</h1>
      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo id/care_stage/regimen_type/thuốc...",
          onSearch: (t) => {
            setSearchTerm(t);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "id", type: "text" as const },
            { label: "Giai đoạn", key: "care_stage", type: "text" as const },
            { label: "Loại", key: "regimen_type", type: "text" as const },
            { label: "Mặc định", key: "is_default", type: "text" as const },
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



