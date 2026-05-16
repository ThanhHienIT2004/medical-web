"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/libs/api/apiClient";
import type { User } from "@/types/user";
import { toast } from "react-toastify";

import { HeaderAdminTable, ActionAdminTable } from "../_components/organisms/table/AdminTable";
import { useSession } from "next-auth/react";
import ConfirmationDialog from "../_components/dialog/ConfirmationDialog";
import AdminTableLayout from "../_components/organisms/table/AdminTableLayout";
import AdminForm, { AdminFormProps } from "../_components/organisms/create-update-form/AdminForm";
import ViewModal, { ViewField } from "../_components/organisms/view/ViewModal";
import { logAdminAction } from "../_libs/auditLog";
import { getCrudAccess } from "../_libs/permissions";
import { buildCrudRowOperations } from "../_libs/tableCrud";

type UserRow = User & {
  role: string;
};

type UpdateUserInput = Partial<
  Pick<UserRow, "full_name" | "email" | "phone" | "address" | "avatar" | "date_of_birth" | "role">
>;

type UserListResponse = {
  data: UserRow[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
};

const USER_HEADERS: HeaderAdminTable[] = [
  { label: "ID", key: "id" },
  { label: "Photo", key: "avatar" },
  { label: "Member name", key: "full_name" },
  { label: "Role", key: "role" },
  { label: "Mobile", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Created at", key: "created_at", type: "date" },
  { label: "Updated at", key: "updated_at", type: "date" },
];

export default function UserManagePage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionAdminTable["type"]>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<unknown[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ total: 0, done: 0, failed: 0, running: false });
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const access = getCrudAccess(session, "users");

  const fetchUsers = useCallback(async (nextPage: number, nextLimit: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient<UserListResponse>(`/users?page=${nextPage}&limit=${nextLimit}`);
      const list = Array.isArray(response.data) ? response.data : [];
      setUsers(
        list.map((user) => ({
          ...user,
          role: user.role ?? "USER",
        }))
      );
      setTotal(typeof response.total === "number" ? response.total : list.length);
      setPage(typeof response.currentPage === "number" ? response.currentPage : nextPage);
      setLimit(typeof response.itemsPerPage === "number" ? response.itemsPerPage : nextLimit);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Khong the tai danh sach nguoi dung");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page, limit);
  }, [fetchUsers, page, limit]);

  const selectedUser = useMemo(
    () => (selectedId ? users.find((user) => user.id === selectedId) ?? null : null),
    [users, selectedId]
  );

  const selectedUserIds = useMemo(
    () => selectedIds.map((value) => String(value)).filter(Boolean),
    [selectedIds]
  );

  const displayedUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter((user) => {
      const name = user.full_name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const phone = user.phone?.toLowerCase() ?? "";
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [searchTerm, users]);

  const updateFields: AdminFormProps<UpdateUserInput>["fields"] = [
    { label: "Ho ten", key: "full_name", type: "text" },
    { label: "Email", key: "email", type: "text" },
    {
      label: "Role",
      key: "role",
      type: "select",
      options: [
        { label: "ADMIN", value: "ADMIN" },
        { label: "DOCTOR", value: "DOCTOR" },
        { label: "USER", value: "USER" },
        { label: "GUEST", value: "GUEST" },
      ],
    },
    { label: "So dien thoai", key: "phone", type: "text" },
    { label: "Dia chi", key: "address", type: "text" },
    { label: "Avatar URL", key: "avatar", type: "text" },
    { label: "Ngay sinh (ISO)", key: "date_of_birth", type: "text" },
  ];

  const renderForm = () => {
    if (selectedAction === "view" && selectedUser) {
      const fields: ViewField[] = [
        { label: "ID", key: "id" },
        { label: "Vai trò", key: "role" },
        { label: "Email", key: "email" },
        { label: "Số điện thoại", key: "phone" },
        { label: "Địa chỉ", key: "address" },
        { label: "Avatar", key: "avatar" },
        { label: "Ngày sinh", key: "date_of_birth" },
      ];

      return (
        <ViewModal
          isOpen={true}
          item={selectedUser}
          title={`Chi tiết người dùng`}
          fields={fields}
          onClose={() => {
            setSelectedId(null);
            setSelectedAction("view");
          }}
        />
      );
    }

    if (selectedAction === "update" && selectedUser) {
      const initialData: UpdateUserInput = {
        full_name: selectedUser.full_name,
        email: selectedUser.email,
        role: selectedUser.role,
        phone: selectedUser.phone,
        address: selectedUser.address,
        avatar: selectedUser.avatar,
        date_of_birth:
          selectedUser.date_of_birth instanceof Date
            ? selectedUser.date_of_birth.toISOString()
            : selectedUser.date_of_birth ?? undefined,
      };
      return (
        <AdminForm<UpdateUserInput>
          title={`Cap nhat user #${selectedUser.id}`}
          submitLabel="Luu"
          initialData={initialData}
          fields={updateFields}
          onClose={() => {
            setSelectedId(null);
            setSelectedAction("view");
          }}
          onSubmit={async (payload) => {
            try {
              const cleanedPayload = Object.fromEntries(
                Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
              );
              await apiClient(`/users/${selectedUser.id}`, { method: "PATCH", body: cleanedPayload });
              toast.success("Cap nhat user thanh cong", { toastId: "user-update-success" });
              logAdminAction({
                action: "update",
                resource: "users",
                resourceId: selectedUser.id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchUsers(page, limit);
              setSelectedId(null);
              setSelectedAction("view");
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : "Cap nhat user that bai";
              toast.error(message, { toastId: "user-update-error" });
            }
          }}
        />
      );
    }

    if (selectedAction === "delete" && selectedUser) {
      return (
        <ConfirmationDialog
          isOpen={true}
          title="Xac nhan xoa user"
          message={`Ban co chac muon xoa user ${selectedUser.full_name}?`}
          onClose={() => setSelectedAction("view")}
          onConfirm={async () => {
            try {
              await apiClient(`/users/${selectedUser.id}`, { method: "DELETE" });
              toast.success("Xoa user thanh cong", { toastId: "user-delete-success" });
              logAdminAction({
                action: "delete",
                resource: "users",
                resourceId: selectedUser.id,
                actorId: session?.user?.id,
                actorRole: session?.user?.role,
              });
              await fetchUsers(page, limit);
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : "Xoa user that bai";
              toast.error(message, { toastId: "user-delete-error" });
            } finally {
              setSelectedAction("view");
            }
          }}
        />
      );
    }

    return null;
  };

  const runBulkDelete = useCallback(async () => {
    const ids = selectedUserIds;
    if (ids.length === 0) return;
    setBulkDeleting(true);
    setBulkProgress({ total: ids.length, done: 0, failed: 0, running: true });

    let done = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await apiClient(`/users/${id}`, { method: "DELETE" });
        done += 1;
      } catch {
        failed += 1;
      } finally {
        setBulkProgress({ total: ids.length, done, failed, running: true });
      }
    }

    setBulkProgress({ total: ids.length, done, failed, running: false });
    setBulkDeleting(false);
    logAdminAction({
      action: "bulk_delete",
      resource: "users",
      actorId: session?.user?.id,
      actorRole: session?.user?.role,
      meta: { count: ids.length, failed },
    });
    toast.success(`Bulk delete xong. Thanh cong: ${done}, loi: ${failed}`, { toastId: "user-bulk-delete-success" });
    setSelectedIds([]);
    await fetchUsers(page, limit);
  }, [fetchUsers, limit, page, selectedUserIds, session?.user?.id, session?.user?.role]);

  return (
    <div className="container mx-auto p-6">
      {renderForm()}
      <h1 className="mb-4 text-2xl font-bold">Quan ly nguoi dung</h1>

      {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mb-3 text-sm text-gray-500">Dang tai du lieu...</p> : null}

      <AdminTableLayout
        searchProps={{
          placeholder: "Tim theo ten, email, so dien thoai",
          onSearch: (value) => {
            setSearchTerm(value);
            setPage(1);
          },
        }}
        tableProps={{
          headers: USER_HEADERS,
          items: displayedUsers,
          action: { type: selectedAction, onClick: (item) => setSelectedId(String(item)) },
          enableSelection: true,
          onSelectionChange: setSelectedIds,
          rowOperations: buildCrudRowOperations<UserRow, string>({
            idKey: "id",
            setSelectedId: (id) => setSelectedId(id),
            setSelectedAction: (action) => setSelectedAction(action),
            allow: { view: access.canView, update: access.canEdit, delete: access.canDelete },
          }),
        }}
        exportCsvProps={{ enabled: true, filename: `users_${new Date().toISOString().slice(0, 10)}.csv` }}
        paginationProps={{
          state: { page, limit, total },
          onPageChange: (nextPage) => setPage(nextPage),
          onLimitChange: (nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          },
        }}
      />

      {selectedUserIds.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600">
            Da chon: <b>{selectedUserIds.length}</b> hang
          </div>
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            disabled={bulkDeleting}
            onClick={() => setConfirmBulkDelete(true)}
          >
            Bulk delete
          </button>
          {bulkProgress.total > 0 ? (
            <div className="text-sm text-gray-600">
              Tien do: {bulkProgress.done}/{bulkProgress.total} - Loi: {bulkProgress.failed}
            </div>
          ) : null}
        </div>
      ) : null}

      <ConfirmationDialog
        isOpen={confirmBulkDelete}
        title="Xac nhan xoa hang loat"
        message={`Ban co chac muon xoa ${selectedUserIds.length} user da chon?`}
        onClose={() => setConfirmBulkDelete(false)}
        onConfirm={async () => {
          setConfirmBulkDelete(false);
          await runBulkDelete();
        }}
      />
    </div>
  );
}
