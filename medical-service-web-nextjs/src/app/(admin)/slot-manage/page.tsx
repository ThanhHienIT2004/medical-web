"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

import AdminTableLayout from "@/app/(admin)/_components/organisms/table/AdminTableLayout";
import type { ActionAdminTable } from "@/app/(admin)/_components/organisms/table/AdminTable";
import AdminForm from "@/app/(admin)/_components/organisms/create-update-form/AdminForm";
import ViewModal, { ViewField } from "@/app/(admin)/_components/organisms/view/ViewModal";
import { apiClient } from "@/libs/api/apiClient";
import type { AppointmentSlot, CreateAppointmentSlotInput, UpdateAppointmentSlotInput } from "@/types/appointmentSlots";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/app/(admin)/_libs/auditLog";
import { buildCrudRowOperations } from "@/app/(admin)/_libs/tableCrud";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

export default function SlotManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleId, setScheduleId] = useState<string>("");

  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<unknown[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const access = getCrudAccess(session, "slots");

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = scheduleId ? `/appointment-slots/schedule/${scheduleId}` : "/appointment-slots";
      const result = await apiClient<AppointmentSlot[]>(endpoint);
      setSlots(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải danh sách slot"));
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return slots;
    return slots.filter((s) => {
      const parts = [s.id, s.schedule_id, s.start_time, s.end_time].join(" ").toLowerCase();
      return parts.includes(term);
    });
  }, [slots, searchTerm]);

  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const selectedSlot = useMemo(
    () => (selectedId ? slots.find((s) => s.id === selectedId) ?? null : null),
    [slots, selectedId]
  );

  const renderForm = () => {
    if (selectedAction === "create") {
      return (
        <AdminForm<CreateAppointmentSlotInput>
          title="Tạo slot"
          submitLabel="Tạo"
          fields={[
            { label: "Schedule ID", key: "schedule_id", type: "text", required: true },
            { label: "Start time (ISO)", key: "start_time", type: "text", required: true },
            { label: "End time (ISO)", key: "end_time", type: "text", required: true },
            { label: "Max patients", key: "max_patients", type: "number" },
            { label: "Booked count", key: "booked_count", type: "number" },
          ]}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              await apiClient("/appointment-slots", { method: "POST", body: data });
              toast.success("Tạo slot thành công", { toastId: "admin-create-slot" });
              logAdminAction({
                action: "create",
                resource: "appointment-slots",
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
                meta: { schedule_id: data.schedule_id },
              });
              await fetchSlots();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Tạo slot thất bại: ${msg}`, { toastId: "admin-create-slot-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "update") {
      if (!selectedSlot) return null;
      return (
        <AdminForm<UpdateAppointmentSlotInput>
          title={`Cập nhật slot #${selectedSlot.id}`}
          submitLabel="Lưu"
          initialData={{
            schedule_id: selectedSlot.schedule_id,
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
            max_patients: selectedSlot.max_patients,
            booked_count: selectedSlot.booked_count,
          }}
          fields={[
            { label: "Schedule ID", key: "schedule_id", type: "text" },
            { label: "Start time (ISO)", key: "start_time", type: "text" },
            { label: "End time (ISO)", key: "end_time", type: "text" },
            { label: "Max patients", key: "max_patients", type: "number" },
            { label: "Booked count", key: "booked_count", type: "number" },
          ]}
          onClose={() => setSelectedAction("view")}
          onSubmit={async (data) => {
            try {
              await apiClient(`/appointment-slots/${selectedSlot.id}`, { method: "PATCH", body: data });
              toast.success("Cập nhật slot thành công", { toastId: "admin-update-slot" });
              logAdminAction({
                action: "update",
                resource: "appointment-slots",
                resourceId: selectedSlot.id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchSlots();
              setSelectedAction("view");
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              toast.error(`Cập nhật slot thất bại: ${msg}`, { toastId: "admin-update-slot-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete") {
      if (!selectedSlot) return null;
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-bold">Xác nhận xóa slot</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              Bạn có chắc chắn muốn xóa slot <b>{selectedSlot.id}</b> không?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                onClick={() => setSelectedAction("view")}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  try {
                    await apiClient(`/appointment-slots/${selectedSlot.id}`, { method: "DELETE" });
                    toast.success("Xóa slot thành công", { toastId: "admin-delete-slot" });
                    logAdminAction({
                      action: "delete",
                      resource: "appointment-slots",
                      resourceId: selectedSlot.id,
                      actorId: session?.user?.id,
                      actorRole: session?.user?.role,
                    });
                    await fetchSlots();
                    setSelectedAction("view");
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err);
                    toast.error(`Xóa slot thất bại: ${msg}`, { toastId: "admin-delete-slot-error" });
                  }
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedAction === "view") {
      if (!selectedSlot) return null;
      const fields: ViewField[] = [
        { label: "ID", key: "id" },
        { label: "Schedule", key: "schedule_id" },
        { label: "Start", key: "start_time" },
        { label: "End", key: "end_time" },
        { label: "Max", key: "max_patients" },
        { label: "Booked", key: "booked_count" },
      ];
      return <ViewModal isOpen={true} item={selectedSlot} title={`Chi tiết slot ${selectedSlot.id}`} fields={fields} onClose={() => setSelectedAction("view")} />;
    }

    return null;
  };

  if (loading) return <Loader className="w-8 h-8 animate-spin mx-auto mt-10" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="text-2xl font-bold mb-4">Quản lý khung giờ (slots)</h1>

      <div className="mb-4 flex gap-3 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Schedule ID:
        </label>
        <input
          value={scheduleId}
          onChange={(e) => {
            setScheduleId(e.target.value);
            setPage(1);
          }}
          placeholder="(tuỳ chọn) lọc theo schedule_id"
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800"
        />
        <button
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() => fetchSlots()}
        >
          Tải lại
        </button>
      </div>

      <AdminTableLayout
        searchProps={{
          placeholder: "Tìm theo id/schedule/time...",
          onSearch: (t) => {
            setSearchTerm(t);
            setPage(1);
          },
        }}
        tableProps={{
          headers: [
            { label: "ID", key: "id", type: "text" as const },
            { label: "Schedule", key: "schedule_id", type: "text" as const },
            { label: "Start", key: "start_time", type: "date" as const },
            { label: "End", key: "end_time", type: "date" as const },
            { label: "Max", key: "max_patients", type: "number" as const },
            { label: "Booked", key: "booked_count", type: "number" as const },
          ],
          items: paged,
          action: { type: selectedAction, onClick: (item) => setSelectedId(item as string) },
          enableSelection: true,
          onSelectionChange: setSelectedIds,
          rowOperations: buildCrudRowOperations<{ id: string }, string>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
        }}
        exportCsvProps={{
          enabled: true,
          filename: `slots_${new Date().toISOString().slice(0, 10)}.csv`,
          onExport: () =>
            logAdminAction({
              action: "export_csv",
              resource: "appointment-slots",
              actorId: session?.user?.id,
              actorRole: session?.user?.role,
              meta: { count: paged.length, scheduleId: scheduleId || null },
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
        <div className="mt-3 text-sm text-gray-600">
          Đã chọn: <b>{selectedIds.length}</b> hàng
        </div>
      ) : null}
    </div>
  );
}

