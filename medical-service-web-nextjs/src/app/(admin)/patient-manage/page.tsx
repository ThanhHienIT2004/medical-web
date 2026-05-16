"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  ListFilter,
  Mail,
  Phone,
  Trash2,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import { useAdminSearch } from "@/components/context/AdminSearchContext";
import { apiClient } from "@/libs/api/apiClient";
import type { Patient } from "@/types/patient";
import Pagination from "@/components/tables/Pagination";
import ViewModal from "@/app/(admin)/_components/view/ViewModal";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";

type PatientRow = {
  patient_id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
};

type PatientSortBy = "full_name" | "email" | "patient_id";
type PatientSortOrder = "asc" | "desc";
type ContactFilter = "ALL" | "HAS_PHONE" | "NO_PHONE";

const CONTACT_OPTIONS: Array<{ label: string; value: ContactFilter }> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Có số điện thoại", value: "HAS_PHONE" },
  { label: "Chưa có số điện thoại", value: "NO_PHONE" },
];

function getInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "P";
  return source.charAt(0).toUpperCase();
}

function PatientAvatar({
  src,
  name,
  email,
}: {
  src?: string;
  name?: string;
  email?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !imageError;

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
      {shouldShowImage ? (
        <Image
          src={src as string}
          alt={name || email || "Ảnh bệnh nhân"}
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
  direction?: PatientSortOrder;
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

function getGenderLabel(gender?: string | null) {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "-";
  }
}

function InputWithIcon({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        {children}
        <span className="absolute left-0 top-1/2 flex h-11 w-[54px] -translate-y-1/2 items-center justify-center border-r border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

type PatientModalMode = "view" | "edit" | "delete";
type PatientFormState = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
};

function PatientFormModal({
  initialPatient,
  loading,
  onClose,
  onSubmit,
}: {
  initialPatient: PatientRow | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (form: PatientFormState) => Promise<void> | void;
}) {
  const [form, setForm] = useState<PatientFormState>({
    full_name: initialPatient?.full_name || "",
    email: initialPatient?.email || "",
    phone: initialPatient?.phone || "",
    address: initialPatient?.address || "",
    date_of_birth: initialPatient?.date_of_birth ? String(initialPatient.date_of_birth).slice(0, 10) : "",
    gender: initialPatient?.gender || "MALE",
  });

  return (
    <div className="p-6 sm:p-7">
      <div className="mb-6 pr-12">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Chỉnh sửa bệnh nhân</p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
          {initialPatient?.full_name || "Bệnh nhân"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cập nhật thông tin liên hệ và hồ sơ cơ bản của bệnh nhân.
        </p>
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit(form);
        }}
        className="space-y-5"
      >
        <InputWithIcon label="Họ tên" icon={<UserRound className="h-5 w-5" />}>
          <input
            value={form.full_name}
            onChange={(e) => setForm((current) => ({ ...current, full_name: e.target.value }))}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            placeholder="Nhập họ tên"
          />
        </InputWithIcon>

        <InputWithIcon label="Email" icon={<Mail className="h-5 w-5" />}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            placeholder="patient@gmail.com"
          />
        </InputWithIcon>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputWithIcon label="Số điện thoại" icon={<Phone className="h-5 w-5" />}>
            <input
              value={form.phone}
              onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Nhập số điện thoại"
            />
          </InputWithIcon>

          <InputWithIcon label="Giới tính" icon={<VenusAndMars className="h-5 w-5" />}>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  gender: e.target.value as "MALE" | "FEMALE" | "OTHER",
                }))
              }
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </InputWithIcon>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputWithIcon label="Địa chỉ" icon={<UserRound className="h-5 w-5" />}>
            <input
              value={form.address}
              onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Nhập địa chỉ"
            />
          </InputWithIcon>

          <InputWithIcon label="Ngày sinh" icon={<UserRound className="h-5 w-5" />}>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm((current) => ({ ...current, date_of_birth: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </InputWithIcon>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Check className="h-4 w-4" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PatientManagePage() {
  const { data: session } = useSession();
  const access = getCrudAccess(session, "patients");
  const { tableSearchTerm } = useAdminSearch();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<PatientSortBy>("full_name");
  const [sortOrder, setSortOrder] = useState<PatientSortOrder>("asc");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<PatientModalMode>("view");
  const [saving, setSaving] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<Patient[]>("/patients");
      setPatients(Array.isArray(result) ? result : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách bệnh nhân");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPatients();
  }, [fetchPatients]);

  const rows = useMemo<PatientRow[]>(
    () =>
      patients.map((patient) => ({
        patient_id: patient.patient_id,
        full_name: patient.user?.full_name ?? "",
        email: patient.user?.email ?? "",
        phone: patient.user?.phone ?? "",
        avatar: patient.user?.avatar ?? "",
        address: patient.user?.address ?? "",
        date_of_birth: patient.user?.date_of_birth ? String(patient.user.date_of_birth) : "",
        gender: patient.gender ?? "OTHER",
      })),
    [patients]
  );

  const displayedRows = useMemo(() => {
    const normalizedSearch = tableSearchTerm.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      const hasPhone = Boolean(row.phone?.trim());
      const matchesContact =
        contactFilter === "ALL"
          ? true
          : contactFilter === "HAS_PHONE"
            ? hasPhone
            : !hasPhone;

      if (!matchesContact) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [row.patient_id, row.full_name, row.email, row.phone]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return [...filtered].sort((a, b) => {
      const firstValue = String(a[sortBy] || "").toLowerCase();
      const secondValue = String(b[sortBy] || "").toLowerCase();
      const compare = firstValue.localeCompare(secondValue, "vi");
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [contactFilter, rows, sortBy, sortOrder, tableSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(displayedRows.length / pageSize));
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, page, pageSize]);

  const selectedPatient = useMemo(
    () => (selectedId ? patients.find((patient) => patient.patient_id === selectedId) ?? null : null),
    [patients, selectedId]
  );
  const selectedRow = useMemo(
    () => (selectedId ? rows.find((row) => row.patient_id === selectedId) ?? null : null),
    [rows, selectedId]
  );

  const handleSortChange = (nextSortBy: PatientSortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder("asc");
  };

  const hasActiveFilter = tableSearchTerm.trim() || contactFilter !== "ALL";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Quản lý bệnh nhân</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tìm kiếm, sắp xếp và xem nhanh thông tin bệnh nhân trong hệ thống.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <ListFilter className="h-4 w-4" />
            Liên hệ
          </div>
          {CONTACT_OPTIONS.map((option) => {
            const isActive = contactFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setContactFilter(option.value);
                  setPage(1);
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
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-violet-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} dòng
              </option>
            ))}
          </select>
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
                      label="Bệnh nhân"
                      active={sortBy === "full_name"}
                      direction={sortBy === "full_name" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("full_name");
                        setPage(1);
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
                        setPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Số điện thoại</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Mã bệnh nhân"
                      active={sortBy === "patient_id"}
                      direction={sortBy === "patient_id" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("patient_id");
                        setPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Thao tác</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-gray-500" colSpan={5}>
                      Đang tải danh sách bệnh nhân...
                    </TableCell>
                  </TableRow>
                ) : pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-10 text-center" colSpan={5}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {hasActiveFilter ? "Không tìm thấy bệnh nhân phù hợp" : "Chưa có bệnh nhân nào"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {hasActiveFilter
                            ? "Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc liên hệ."
                            : "Danh sách sẽ hiển thị ở đây khi hệ thống có dữ liệu."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRows.map((row) => (
                    <TableRow key={row.patient_id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <PatientAvatar src={row.avatar} name={row.full_name} email={row.email} />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {row.full_name || "Chưa có tên"}
                            </div>
                            <div className="text-sm text-gray-500">{row.patient_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">{row.email || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{row.phone || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{row.patient_id}</TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {access.canView ? (
                            <button
                              title="Xem"
                              onClick={() => {
                                setSelectedId(row.patient_id);
                                setMode("view");
                              }}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                          ) : null}

                          {access.canEdit ? (
                            <button
                              title="Sửa"
                              onClick={() => {
                                setSelectedId(row.patient_id);
                                setMode("edit");
                              }}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                              </svg>
                            </button>
                          ) : null}

                          {access.canDelete ? (
                            <button
                              title="Xóa"
                              onClick={() => {
                                setSelectedId(row.patient_id);
                                setMode("delete");
                              }}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          ) : null}
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

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {mode === "view" && selectedPatient ? (
        <ViewModal
          isOpen={true}
          item={{
            patient_id: selectedPatient.patient_id,
            full_name: selectedPatient.user?.full_name ?? "-",
            email: selectedPatient.user?.email ?? "-",
            phone: selectedPatient.user?.phone ?? "-",
            address: selectedPatient.user?.address ?? "-",
            date_of_birth: selectedPatient.user?.date_of_birth ?? "-",
            gender: getGenderLabel(selectedPatient.gender),
          }}
          title={`Chi tiết bệnh nhân ${selectedPatient.patient_id}`}
          fields={[
            { label: "Mã bệnh nhân", key: "patient_id" },
            { label: "Họ tên", key: "full_name" },
            { label: "Email", key: "email" },
            { label: "Số điện thoại", key: "phone" },
            { label: "Địa chỉ", key: "address" },
            { label: "Ngày sinh", key: "date_of_birth" },
            { label: "Giới tính", key: "gender" },
          ]}
          onClose={() => {
            setSelectedId(null);
            setMode("view");
          }}
        />
      ) : null}

      <Modal isOpen={mode === "edit" && Boolean(selectedRow)} onClose={() => { setSelectedId(null); setMode("view"); }} className="mx-4 max-w-[720px]">
        {mode === "edit" && selectedRow ? (
          <PatientFormModal
            initialPatient={selectedRow}
            loading={saving}
            onClose={() => {
              setSelectedId(null);
              setMode("view");
            }}
            onSubmit={async (form) => {
              if (!selectedId) return;
              try {
                setSaving(true);
                await apiClient(`/patients/${selectedId}`, {
                  method: "PATCH",
                  body: {
                    gender: form.gender,
                    user: {
                      full_name: form.full_name || undefined,
                      email: form.email || undefined,
                      phone: form.phone || undefined,
                      address: form.address || undefined,
                      date_of_birth: form.date_of_birth || undefined,
                    },
                  },
                });
                toast.success("Cập nhật bệnh nhân thành công", { toastId: "patient-update-success" });
                await fetchPatients();
                setSelectedId(null);
                setMode("view");
              } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                toast.error(`Cập nhật thất bại: ${message}`, { toastId: "patient-update-error" });
              } finally {
                setSaving(false);
              }
            }}
          />
        ) : null}
      </Modal>

      <Modal isOpen={mode === "delete" && Boolean(selectedRow)} onClose={() => { setSelectedId(null); setMode("view"); }} className="mx-4 max-w-[560px]">
        {mode === "delete" && selectedRow ? (
          <div className="p-6 sm:p-7">
            <div className="flex gap-4 pr-12">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-300">Xác nhận xóa</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  Xóa bệnh nhân này?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Bạn sắp xóa{" "}
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedRow.full_name || selectedRow.email || "bệnh nhân này"}
                  </span>
                  . Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setMode("view");
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                Hủy
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  if (!selectedId) return;
                  try {
                    setSaving(true);
                    await apiClient(`/patients/${selectedId}`, { method: "DELETE" });
                    toast.success("Xóa bệnh nhân thành công", { toastId: "patient-delete-success" });
                    await fetchPatients();
                    setSelectedId(null);
                    setMode("view");
                  } catch (e) {
                    const message = e instanceof Error ? e.message : String(e);
                    toast.error(`Xóa thất bại: ${message}`, { toastId: "patient-delete-error" });
                  } finally {
                    setSaving(false);
                  }
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {saving ? "Đang xóa..." : "Xóa bệnh nhân"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
