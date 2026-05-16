"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowDownAZ, ArrowUpAZ, ListFilter, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminSearch } from "@/components/context/AdminSearchContext";
import UserForm from "@/features/users/components/UserForm";
import UserView from "@/features/users/components/UserView";
import {
  useDeleteUser,
  useGetUsers,
  type UserSortBy,
  type UserSortOrder,
} from "@/features/users/hooks/useUsers";
import Pagination from "@/components/tables/Pagination";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

type UserModalMode = "view" | "edit" | "create" | "delete";
type UserRoleFilter = "ALL" | "ADMIN" | "DOCTOR" | "USER";

const ROLE_OPTIONS: Array<{ label: string; value: UserRoleFilter }> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "Bác sĩ", value: "DOCTOR" },
  { label: "Người dùng", value: "USER" },
];

function getInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";
  return source.charAt(0).toUpperCase();
}

function UserAvatar({
  src,
  name,
  email,
}: {
  src?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  const [imageError, setImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !imageError;

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
      {shouldShowImage ? (
        <Image
          src={src as string}
          alt={name || email || "Ảnh người dùng"}
          fill
          sizes="40px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        getInitial(name, email)
      )}
    </div>
  );
}

function SortButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction?: UserSortOrder;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 transition-colors ${
        active
          ? "text-violet-700 dark:text-violet-300"
          : "text-gray-900 hover:text-violet-700 dark:text-white/90 dark:hover:text-violet-300"
      }`}
    >
      <span>{label}</span>
      {active ? (
        direction === "asc" ? (
          <ArrowUpAZ className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownAZ className="h-3.5 w-3.5" />
        )
      ) : null}
    </button>
  );
}

function getRoleBadgeClass(role?: string | null) {
  switch ((role || "USER").toUpperCase()) {
    case "ADMIN":
      return "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900";
    case "DOCTOR":
      return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900";
    default:
      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900";
  }
}

export default function UserManagePage() {
  const { tableSearchTerm } = useAdminSearch();
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("ALL");
  const [sortBy, setSortBy] = useState<UserSortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<UserSortOrder>("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<UserModalMode>("view");

  const { users, loading, error, page, pageSize, totalPages, refetch, goToPage, setPageSize } = useGetUsers(1, 10, {
    search: tableSearchTerm,
    role: roleFilter === "ALL" ? "" : roleFilter,
    sortBy,
    sortOrder,
  });
  const { remove, loading: deleting } = useDeleteUser();

  const displayedUsers = useMemo(() => {
    const normalizedSearch = tableSearchTerm.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const matchesRole = roleFilter === "ALL" ? true : (user.role || "USER") === roleFilter;

      if (!matchesRole) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [user.id, user.full_name, user.email, user.phone, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "created_at") {
        const first = a.created_at ? new Date(a.created_at).getTime() : 0;
        const second = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === "asc" ? first - second : second - first;
      }

      const firstValue = String(a[sortBy] || "").toLowerCase();
      const secondValue = String(b[sortBy] || "").toLowerCase();
      const compare = firstValue.localeCompare(secondValue, "vi");

      return sortOrder === "asc" ? compare : -compare;
    });
  }, [roleFilter, sortBy, sortOrder, tableSearchTerm, users]);

  const selectedUser = editingId ? users.find((user) => user.id === editingId) : null;

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setMode("view");
  };

  const handleDelete = async () => {
    if (!editingId) return;

    try {
      await remove(editingId);
      await refetch();
      closeModal();
      toast.success("Xóa người dùng thành công", { toastId: "admin-delete-user" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Xóa người dùng thất bại: ${msg}`, { toastId: "admin-delete-user-error" });
    }
  };

  const handleSortChange = (nextSortBy: UserSortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder(nextSortBy === "created_at" ? "desc" : "asc");
  };

  const hasActiveFilter = tableSearchTerm.trim() || roleFilter !== "ALL";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tìm kiếm, sắp xếp và lọc danh sách tài khoản trong hệ thống.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setMode("create");
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tạo mới
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <ListFilter className="h-4 w-4" />
            Vai trò
          </div>
          {ROLE_OPTIONS.map((option) => {
            const isActive = roleFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setRoleFilter(option.value);
                  goToPage(1);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-violet-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} dòng
              </option>
            ))}
          </select>
          <span>Sắp xếp:</span>
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            {sortBy === "created_at"
              ? sortOrder === "desc"
                ? "Mới nhất"
                : "Cũ nhất"
              : sortBy === "full_name"
                ? sortOrder === "asc"
                  ? "Tên A-Z"
                  : "Tên Z-A"
                : sortOrder === "asc"
                  ? "Email A-Z"
                  : "Email Z-A"}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Người dùng"
                      active={sortBy === "full_name"}
                      direction={sortBy === "full_name" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("full_name");
                        goToPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Email"
                      active={sortBy === "email"}
                      direction={sortBy === "email" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("email");
                        goToPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Số điện thoại</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Vai trò</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Thời gian tạo"
                      active={sortBy === "created_at"}
                      direction={sortBy === "created_at" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("created_at");
                        goToPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Thao tác</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-gray-500" colSpan={6}>
                      Đang tải danh sách người dùng...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-red-500" colSpan={6}>
                      {error.message}
                    </TableCell>
                  </TableRow>
                ) : displayedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-10 text-center" colSpan={6}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {hasActiveFilter ? "Không tìm thấy người dùng phù hợp" : "Chưa có người dùng nào"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {hasActiveFilter
                            ? "Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc vai trò."
                            : "Danh sách sẽ hiển thị ở đây khi hệ thống có dữ liệu."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <UserAvatar src={u.avatar} name={u.full_name} email={u.email} />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {u.full_name || "Chưa có tên"}
                            </div>
                            <div className="text-sm text-gray-500">{u.id}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">{u.email}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{u.phone || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(
                            u.role
                          )}`}
                        >
                          {u.role || "USER"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {u.created_at ? new Date(u.created_at).toLocaleString("vi-VN") : "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <button
                            title="Xem"
                            onClick={() => {
                              setEditingId(u.id);
                              setMode("view");
                              setModalOpen(true);
                            }}
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          <button
                            title="Sửa"
                            onClick={() => {
                              setEditingId(u.id);
                              setMode("edit");
                              setModalOpen(true);
                            }}
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </button>

                          <button
                            title="Xóa"
                            onClick={() => {
                              setEditingId(u.id);
                              setMode("delete");
                              setModalOpen(true);
                            }}
                            disabled={deleting}
                            className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-gray-800"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => goToPage(p)} />

      <Modal isOpen={modalOpen} onClose={closeModal} className="mx-4 max-w-[640px]">
        {mode === "create" && (
          <UserForm
            mode="create"
            onClose={closeModal}
            onSaved={() => {
              refetch();
              toast.success("Tạo người dùng thành công", { toastId: "admin-create-user" });
            }}
          />
        )}
        {editingId && mode === "edit" && (
          <UserForm
            id={editingId}
            mode="edit"
            onClose={closeModal}
            onSaved={() => {
              refetch();
              toast.success("Cập nhật người dùng thành công", { toastId: "admin-update-user" });
            }}
          />
        )}
        {editingId && mode === "view" && <UserView id={editingId} />}
        {editingId && mode === "delete" && (
          <div className="p-6 sm:p-7">
            <div className="flex gap-4 pr-12">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-300">Xác nhận xóa</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  Xóa người dùng này?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Bạn sắp xóa{" "}
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedUser?.full_name || selectedUser?.email || "người dùng này"}
                  </span>
                  . Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Đang xóa..." : "Xóa người dùng"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
