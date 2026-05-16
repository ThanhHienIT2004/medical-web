"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowUpAZ,
  BriefcaseMedical,
  Check,
  GraduationCap,
  Hospital,
  ListFilter,
  Lock,
  Mail,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import { useAdminSearch } from "@/components/context/AdminSearchContext";
import ViewModal, { ViewField } from "@/app/(admin)/_components/view/ViewModal";
import Pagination from "@/components/tables/Pagination";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getCrudAccess } from "@/app/(admin)/_libs/permissions";
import { useRegisterDoctor } from "@/features/doctors/hooks/useCreateDoctor";
import { useDeleteDoctor } from "@/features/doctors/hooks/userDeleteDoctor";
import { useGetDoctors } from "@/features/doctors/hooks/useGetDoctors";
import { useUpdateDoctor } from "@/features/doctors/hooks/useUpdateDoctor";
import { UpdateDoctorInput } from "@/types/doctors";
import { RegisterDoctorInput } from "@/types/register";

type DoctorModalMode = "view" | "create" | "update" | "delete";
type GenderFilter = "ALL" | "MALE" | "FEMALE" | "OTHER";
type DoctorSortBy = "full_name" | "email" | "work_seniority";
type DoctorSortOrder = "asc" | "desc";

const GENDER_OPTIONS: Array<{ label: string; value: GenderFilter }> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

function getInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "B";
  return source.charAt(0).toUpperCase();
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

function DoctorAvatar({
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
          alt={name || email || "Ảnh bác sĩ"}
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
  direction?: DoctorSortOrder;
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

type DoctorFormState = {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  qualifications: string;
  work_seniority: string;
  specialty: string;
  hospital: string;
};

function DoctorFormModal({
  mode,
  initialDoctor,
  loading,
  onClose,
  onSubmit,
}: {
  mode: "create" | "update";
  initialDoctor?: DoctorDisplay | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (form: DoctorFormState) => Promise<void> | void;
}) {
  const isCreate = mode === "create";
  const [form, setForm] = useState<DoctorFormState>({
    full_name: initialDoctor?.full_name || "",
    email: initialDoctor?.email || "",
    password: "",
    phone: initialDoctor?.phone || "",
    gender: (initialDoctor?.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
    qualifications: initialDoctor?.qualifications || "",
    work_seniority:
      initialDoctor?.work_seniority === null || initialDoctor?.work_seniority === undefined
        ? ""
        : String(initialDoctor.work_seniority),
    specialty: initialDoctor?.specialty || "",
    hospital: initialDoctor?.hospital || "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="p-6 sm:p-7">
      <div className="mb-6 pr-12">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          {isCreate ? "Tạo bác sĩ" : "Chỉnh sửa bác sĩ"}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
          {isCreate ? "Bác sĩ mới" : initialDoctor?.full_name || "Bác sĩ"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isCreate
            ? "Thêm tài khoản bác sĩ mới với các thông tin cơ bản."
            : "Cập nhật thông tin hành nghề và liên hệ của bác sĩ."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputWithIcon label="Họ tên" icon={<UserRound className="h-5 w-5" />}>
          <input
            value={form.full_name}
            onChange={(e) => setForm((current) => ({ ...current, full_name: e.target.value }))}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            placeholder="Nhập họ tên"
            required
          />
        </InputWithIcon>

        <InputWithIcon label="Email" icon={<Mail className="h-5 w-5" />}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            placeholder="doctor@gmail.com"
            required
          />
        </InputWithIcon>

        {isCreate ? (
          <InputWithIcon label="Mật khẩu" icon={<Lock className="h-5 w-5" />}>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Nhập mật khẩu"
              required
            />
          </InputWithIcon>
        ) : null}

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

        <div className="grid gap-5 sm:grid-cols-2">
          <InputWithIcon label="Bằng cấp" icon={<GraduationCap className="h-5 w-5" />}>
            <input
              value={form.qualifications}
              onChange={(e) => setForm((current) => ({ ...current, qualifications: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Bác sĩ CKI"
            />
          </InputWithIcon>

          <InputWithIcon label="Kinh nghiệm" icon={<BriefcaseMedical className="h-5 w-5" />}>
            <input
              type="number"
              value={form.work_seniority}
              onChange={(e) => setForm((current) => ({ ...current, work_seniority: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="5"
            />
          </InputWithIcon>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputWithIcon label="Chuyên khoa" icon={<Stethoscope className="h-5 w-5" />}>
            <input
              value={form.specialty}
              onChange={(e) => setForm((current) => ({ ...current, specialty: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Tim mạch"
            />
          </InputWithIcon>

          <InputWithIcon label="Bệnh viện" icon={<Hospital className="h-5 w-5" />}>
            <input
              value={form.hospital}
              onChange={(e) => setForm((current) => ({ ...current, hospital: e.target.value }))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              placeholder="Bệnh viện Chợ Rẫy"
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
            {loading ? "Đang lưu..." : isCreate ? "Tạo bác sĩ" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function DoctorManagePage() {
  const { data: session } = useSession();
  const { tableSearchTerm } = useAdminSearch();
  const access = getCrudAccess(session, "doctors");

  const [genderFilter, setGenderFilter] = useState<GenderFilter>("ALL");
  const [sortBy, setSortBy] = useState<DoctorSortBy>("full_name");
  const [sortOrder, setSortOrder] = useState<DoctorSortOrder>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<DoctorModalMode>("view");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { doctors, loading: initLoading, error: errorDoctors, refetch: refetchDoctors } = useGetDoctors();
  const { register: registerDoctor, loading: createLoading, error: errorCreate } = useRegisterDoctor();
  const { update: updateDoctor, loading: updateLoading, error: errorUpdate } = useUpdateDoctor();
  const { delete: deleteDoctor, loading: deleteLoading, error: errorDelete } = useDeleteDoctor();

  const loading = initLoading || createLoading || updateLoading || deleteLoading;
  const error = errorDoctors || errorCreate || errorUpdate || errorDelete;

  const displayedDoctors = useMemo(() => {
    const normalizedSearch = tableSearchTerm.trim().toLowerCase();

    const filtered = doctors.filter((doctor) => {
      const matchesGender = genderFilter === "ALL" ? true : (doctor.gender || "OTHER") === genderFilter;

      if (!matchesGender) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        doctor.id,
        doctor.full_name,
        doctor.email,
        doctor.phone,
        doctor.specialty,
        doctor.hospital,
        doctor.qualifications,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "work_seniority") {
        const first = a.work_seniority ?? 0;
        const second = b.work_seniority ?? 0;
        return sortOrder === "asc" ? first - second : second - first;
      }

      const firstValue = String(a[sortBy] || "").toLowerCase();
      const secondValue = String(b[sortBy] || "").toLowerCase();
      const compare = firstValue.localeCompare(secondValue, "vi");

      return sortOrder === "asc" ? compare : -compare;
    });
  }, [doctors, genderFilter, sortBy, sortOrder, tableSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(displayedDoctors.length / pageSize));
  const pagedDoctors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return displayedDoctors.slice(start, start + pageSize);
  }, [displayedDoctors, page, pageSize]);

  const selectedDoctor = selectedId ? doctors.find((doctor) => doctor.id === selectedId) ?? null : null;

  const closeModal = () => {
    setSelectedId(null);
    setMode("view");
  };

  const handleSortChange = (nextSortBy: DoctorSortBy) => {
    if (sortBy === nextSortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder(nextSortBy === "work_seniority" ? "desc" : "asc");
  };

  async function handleCreateSubmit(data: RegisterDoctorInput) {
    try {
      await registerDoctor(data);
      await refetchDoctors();
      toast.success("Tạo tài khoản bác sĩ thành công", { toastId: "doctor-create-success" });
      closeModal();
    } catch (err) {
      console.error("Create doctor error:", err);
    }
  }

  async function handleUpdateSubmit(formData: UpdateDoctorInput) {
    if (!selectedId) return;

    try {
      await updateDoctor(selectedId, formData);
      await refetchDoctors();
      toast.success("Cập nhật bác sĩ thành công", { toastId: "doctor-update-success" });
      closeModal();
    } catch (err) {
      console.error("Update doctor error:", err);
    }
  }

  async function handleDeleteSubmit() {
    if (!selectedId) return;

    try {
      await deleteDoctor(selectedId);
      await refetchDoctors();
      toast.success("Xóa bác sĩ thành công", { toastId: "doctor-delete-success" });
    } catch (err) {
      console.error("Delete doctor error:", err);
    }
  }

  const viewFields: ViewField[] = [
    { label: "Email", key: "email" },
    { label: "Họ và tên", key: "full_name" },
    { label: "Số điện thoại", key: "phone" },
    { label: "Địa chỉ", key: "address" },
    { label: "Giới tính", key: "gender" },
    { label: "Ngày sinh", key: "date_of_birth" },
    { label: "Bằng cấp", key: "qualifications" },
    { label: "Kinh nghiệm", key: "work_seniority" },
    { label: "Chuyên khoa", key: "specialty" },
    { label: "Bệnh viện", key: "hospital" },
  ];

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">Đang tải danh sách bác sĩ...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-sm text-red-500">{error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Quản lý bác sĩ</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tìm kiếm, sắp xếp và quản lý hồ sơ bác sĩ trong hệ thống.
          </p>
        </div>
        {access.canCreate ? (
          <button
            type="button"
            onClick={() => {
              setSelectedId(null);
              setMode("create");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Tạo mới
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <ListFilter className="h-4 w-4" />
            Giới tính
          </div>
          {GENDER_OPTIONS.map((option) => {
            const isActive = genderFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setGenderFilter(option.value);
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
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Bác sĩ"
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
                  <TableCell isHeader className="px-5 py-3 text-start">Giới tính</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    <SortButton
                      label="Kinh nghiệm"
                      active={sortBy === "work_seniority"}
                      direction={sortBy === "work_seniority" ? sortOrder : undefined}
                      onClick={() => {
                        handleSortChange("work_seniority");
                        setPage(1);
                      }}
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Chuyên khoa</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Bệnh viện</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">Thao tác</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {pagedDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-10 text-center" colSpan={8}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Không tìm thấy bác sĩ phù hợp
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc giới tính.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <DoctorAvatar src={doctor.avatar} name={doctor.full_name} email={doctor.email} />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {doctor.full_name || "Chưa có tên"}
                            </div>
                            <div className="text-sm text-gray-500">{doctor.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">{doctor.email || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{doctor.phone || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{getGenderLabel(doctor.gender)}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{doctor.work_seniority ?? "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{doctor.specialty || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">{doctor.hospital || "-"}</TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {access.canView ? (
                            <button
                              title="Xem"
                              onClick={() => {
                                setSelectedId(doctor.id);
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
                                setSelectedId(doctor.id);
                                setMode("update");
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
                                setSelectedId(doctor.id);
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

      <Modal isOpen={mode === "create"} onClose={closeModal} className="mx-4 max-w-[720px]">
        {mode === "create" ? (
          <DoctorFormModal
            mode="create"
            loading={createLoading}
            onClose={closeModal}
            onSubmit={async (form) => {
              await handleCreateSubmit({
                full_name: form.full_name,
                email: form.email,
                password: form.password,
                gender: form.gender,
                role: "DOCTOR",
              });
            }}
          />
        ) : null}
      </Modal>

      <Modal isOpen={mode === "update" && Boolean(selectedDoctor)} onClose={closeModal} className="mx-4 max-w-[720px]">
        {mode === "update" && selectedDoctor ? (
          <DoctorFormModal
            mode="update"
            initialDoctor={selectedDoctor}
            loading={updateLoading}
            onClose={closeModal}
            onSubmit={async (form) => {
              const payload: UpdateDoctorInput = {
                full_name: form.full_name,
                email: form.email,
                gender: form.gender,
                qualifications: form.qualifications || null,
                work_seniority: form.work_seniority ? Number(form.work_seniority) : null,
                specialty: form.specialty || null,
                hospital: form.hospital || null,
              };
              await handleUpdateSubmit(payload);
            }}
          />
        ) : null}
      </Modal>

      {mode === "view" && selectedDoctor ? (
        <ViewModal
          isOpen={true}
          item={{
            ...selectedDoctor,
            gender: getGenderLabel(selectedDoctor.gender),
          }}
          title="Chi tiết bác sĩ"
          fields={viewFields}
          onClose={closeModal}
        />
      ) : null}

      <Modal isOpen={mode === "delete" && Boolean(selectedDoctor)} onClose={closeModal} className="mx-4 max-w-[560px]">
        {selectedDoctor ? (
          <div className="p-6 sm:p-7">
            <div className="flex gap-4 pr-12">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-300">Xác nhận xóa</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  Xóa bác sĩ này?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Bạn sắp xóa{" "}
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedDoctor.full_name || selectedDoctor.email || "bác sĩ này"}
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
                onClick={async () => {
                  await handleDeleteSubmit();
                  closeModal();
                }}
                disabled={deleteLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {deleteLoading ? "Đang xóa..." : "Xóa bác sĩ"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
