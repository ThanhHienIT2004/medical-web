"use client";

import { apiClient } from "@/libs/api/apiClient";
import { AppointmentStatus, Appointment } from "@/types/appointment";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ActionAdminTable } from "@/app/(admin)/_components/organisms/table/AdminTable";
import AdminTableLayout from "@/app/(admin)/_components/organisms/table/AdminTableLayout";
import AdminForm from "@/app/(admin)/_components/organisms/create-update-form/AdminForm";
import ViewModal, { ViewField } from "@/app/(admin)/_components/organisms/view/ViewModal";
import { logAdminAction } from "@/app/(admin)/_libs/auditLog";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";

export default function AppointmentManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<unknown[]>([]);
  const [bulkAction, setBulkAction] = useState<null | { type: "status"; status: AppointmentStatus } | { type: "delete" }>(null);
  const [bulkProgress, setBulkProgress] = useState<{ total: number; done: number; failed: number; running: boolean }>({
    total: 0,
    done: 0,
    failed: 0,
    running: false,
  });
  const [lastBulkRollback, setLastBulkRollback] = useState<null | { ids: number[]; prevStatus: AppointmentStatus }>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "appointments");

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<Appointment[]>("/appointments");
      setAppointments(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải lịch hẹn"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter((a) => {
      const parts = [
        String(a.appointment_id),
        a.patient_id,
        a.doctor_id,
        a.slot_id,
        a.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return parts.includes(term);
    });
  }, [appointments, searchTerm]);

  const total = filteredAppointments.length;
  const pagedAppointments = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAppointments.slice(start, start + limit);
  }, [filteredAppointments, page, limit]);

  const headers = useMemo(
    () => [
      { label: "ID", key: "appointment_id", type: "number" as const },
      { label: "Patient", key: "patient_id", type: "text" as const },
      { label: "Doctor", key: "doctor_id", type: "text" as const },
      { label: "Slot", key: "slot_id", type: "text" as const },
      { label: "Ngày hẹn", key: "appointment_date", type: "date" as const },
      { label: "Trạng thái", key: "status", type: "text" as const },
      { label: "Đã khám", key: "is_done", type: "text" as const },
    ],
    []
  );

  const selectedAppointment = useMemo(
    () => (selectedId ? appointments.find((a) => a.appointment_id === selectedId) ?? null : null),
    [appointments, selectedId]
  );

  const selectedAppointmentIds = useMemo(
    () => selectedIds.map((x) => Number(x)).filter((n) => Number.isFinite(n)),
    [selectedIds],
  );

  const runBulkUpdateStatus = useCallback(async (newStatus: AppointmentStatus) => {
    const ids = selectedAppointmentIds;
    if (ids.length === 0) return;
    setBulkProgress({ total: ids.length, done: 0, failed: 0, running: true });

    let done = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient(`/appointments/${id}/status`, { method: "PATCH", body: { status: newStatus } });
        done += 1;
      } catch {
        failed += 1;
      } finally {
        setBulkProgress((p) => ({ ...p, done, failed }));
      }
    }

    setBulkProgress((p) => ({ ...p, running: false }));
    logAdminAction({
      action: "update",
      resource: "appointments",
      actorId: session?.user?.id,
      actorRole: session?.user?.role,
      meta: { bulk: true, status: newStatus, count: ids.length, failed },
    });
    await fetchAppointments();
  }, [selectedAppointmentIds, session?.user?.id, session?.user?.role, fetchAppointments]);

  const runBulkDelete = useCallback(async () => {
    const ids = selectedAppointmentIds;
    if (ids.length === 0) return;

    setBulkProgress({ total: ids.length, done: 0, failed: 0, running: true });
    let done = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient(`/appointments/${id}`, { method: "DELETE" });
        done += 1;
      } catch {
        failed += 1;
      } finally {
        setBulkProgress((p) => ({ ...p, done, failed }));
      }
    }
    setBulkProgress((p) => ({ ...p, running: false }));
    logAdminAction({
      action: "bulk_delete",
      resource: "appointments",
      actorId: session?.user?.id,
      actorRole: session?.user?.role,
      meta: { count: ids.length, failed },
    });
    await fetchAppointments();
  }, [selectedAppointmentIds, session?.user?.id, session?.user?.role, fetchAppointments]);

  const bulkModal = bulkAction ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
        <h3 className="text-lg font-bold">
          {bulkAction.type === "delete" ? "Xác nhận xóa hàng loạt" : "Xác nhận cập nhật trạng thái hàng loạt"}
        </h3>
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          Số lượng đã chọn: <b>{selectedAppointmentIds.length}</b>
        </p>
        {bulkAction.type === "status" ? (
          <p className="mt-1 text-gray-700 dark:text-gray-200">
            Trạng thái mới: <b>{String(bulkAction.status)}</b>
          </p>
        ) : null}

        {bulkProgress.total > 0 ? (
          <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
            Tiến độ: {bulkProgress.done}/{bulkProgress.total} • Lỗi: {bulkProgress.failed}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            disabled={bulkProgress.running}
            onClick={() => setBulkAction(null)}
          >
            Đóng
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${bulkAction.type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={bulkProgress.running || selectedAppointmentIds.length === 0}
            onClick={async () => {
              try {
                if (bulkAction.type === "status") {
                  setLastBulkRollback({ ids: [...selectedAppointmentIds], prevStatus: "PENDING" });
                  await runBulkUpdateStatus(bulkAction.status);
                  toast.success("Bulk update status xong", { toastId: "bulk-status-done" });
                } else {
                  await runBulkDelete();
                  toast.success("Bulk delete xong", { toastId: "bulk-delete-done" });
                }
              } finally {
                setBulkAction(null);
              }
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  ) : null;

  type UpdateAppointmentAdminForm = {
    status: AppointmentStatus;
    is_done: number;
  };

  const renderForm = () => {
    if (selectedAction === "view" && selectedAppointment) {
      const viewFields: ViewField[] = headers.map(h => ({ label: h.label, key: h.key }));
      return <ViewModal isOpen={true} item={selectedAppointment} title={`Chi tiết lịch hẹn #${selectedAppointment.appointment_id}`} fields={viewFields} onClose={() => setSelectedAction("view")} />;
    }

    if (selectedAction !== "update") return null;
    if (!selectedAppointment) return null;

    return (
      <AdminForm<UpdateAppointmentAdminForm>
        title={`Cập nhật lịch hẹn #${selectedAppointment.appointment_id}`}
        submitLabel="Lưu"
        initialData={{
          status: selectedAppointment.status,
          is_done: selectedAppointment.is_done ? 1 : 0,
        }}
        fields={[
          {
            label: "Trạng thái",
            key: "status",
            type: "select",
            required: true,
            options: [
              { label: "PENDING", value: "PENDING" },
              { label: "COMPLETED", value: "COMPLETED" },
              { label: "CANCELLED", value: "CANCELLED" },
            ],
          },
          {
            label: "Đã khám",
            key: "is_done",
            type: "select",
            required: true,
            options: [
              { label: "Chưa", value: 0 },
              { label: "Rồi", value: 1 },
            ],
          },
        ]}
        onClose={() => setSelectedAction("view")}
        onSubmit={async (formData) => {
          try {
            await apiClient(`/appointments/${selectedAppointment.appointment_id}/status`, {
              method: "PATCH",
              body: { status: formData.status },
            });
            await apiClient(`/appointments/${selectedAppointment.appointment_id}`, {
              method: "PATCH",
              body: { is_done: Boolean(formData.is_done) },
            });
            toast.success("Cập nhật lịch hẹn thành công", { toastId: "admin-update-appointment" });
            logAdminAction({
              action: "update",
              resource: "appointments",
              resourceId: String(selectedAppointment.appointment_id),
              actorId: session?.user?.id,
              actorRole: session?.user?.role,
              meta: { status: formData.status, is_done: Boolean(formData.is_done) },
            });
            await fetchAppointments();
            setSelectedAction("view");
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Cập nhật thất bại: ${message}`, { toastId: "admin-update-appointment-error" });
          }
        }}
      />
    );
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      {bulkModal}
      <h1 className="text-2xl font-bold mb-4">Quản lý lịch hẹn</h1>
      <AdminTableLayout
        searchProps={{ placeholder: "Tìm kiếm theo id/patient/doctor/status...", onSearch: (t) => { setSearchTerm(t); setPage(1); } }}
        tableProps={{
          headers,
          items: pagedAppointments,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as number) },
          enableSelection: true,
          onSelectionChange: setSelectedIds,
          rowOperations: buildCrudRowOperations<{ appointment_id: number }, number>({
            idKey: "appointment_id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
        }}
        exportCsvProps={{
          enabled: true,
          filename: `appointments_${new Date().toISOString().slice(0, 10)}.csv`,
          onExport: () =>
            logAdminAction({
              action: "export_csv",
              resource: "appointments",
              actorId: session?.user?.id,
              actorRole: session?.user?.role,
              meta: { count: pagedAppointments.length },
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
      {selectedIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600">
            Đã chọn: <b>{selectedIds.length}</b> hàng
          </div>
          <button
            className="px-3 py-2 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm"
            onClick={() => setBulkAction({ type: "status", status: "CANCELLED" })}
          >
            Bulk CANCELLED
          </button>
          <button
            className="px-3 py-2 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-sm"
            onClick={() => setBulkAction({ type: "status", status: "COMPLETED" })}
          >
            Bulk COMPLETED
          </button>
          <button
            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
            onClick={() => setBulkAction({ type: "delete" })}
          >
            Bulk delete
          </button>
          {lastBulkRollback ? (
            <button
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={async () => {
                const ids = lastBulkRollback.ids;
                setBulkProgress({ total: ids.length, done: 0, failed: 0, running: true });
                let done = 0;
                let failed = 0;
                for (const id of ids) {
                  try {
                    await apiClient(`/appointments/${id}/status`, { method: "PATCH", body: { status: lastBulkRollback.prevStatus } });
                    done += 1;
                  } catch {
                    failed += 1;
                  } finally {
                    setBulkProgress((p) => ({ ...p, done, failed }));
                  }
                }
                setBulkProgress((p) => ({ ...p, running: false }));
                toast.success("Rollback status xong", { toastId: "bulk-rollback-done" });
                logAdminAction({
                  action: "update",
                  resource: "appointments",
                  actorId: session?.user?.id,
                  actorRole: session?.user?.role,
                  meta: { bulkRollback: true, status: lastBulkRollback.prevStatus, count: ids.length, failed },
                });
                await fetchAppointments();
                setLastBulkRollback(null);
              }}
            >
              Rollback (PENDING)
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

