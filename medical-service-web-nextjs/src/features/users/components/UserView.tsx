"use client";

import React from "react";
import { useGetUser } from "@/features/users/hooks/useUsers";
import { CalendarClock, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

interface Props {
  id: string;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("vi-VN");
}

function ViewField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex h-11 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-900">
        <span className="flex w-[54px] shrink-0 items-center justify-center border-r border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {icon}
        </span>
        <div className="flex min-w-0 flex-1 items-center px-4 text-sm font-medium text-gray-800 dark:text-white/90">
          <span className="truncate">{value || "-"}</span>
        </div>
      </div>
    </div>
  );
}

export default function UserView({ id }: Props) {
  const { user, loading, error } = useGetUser(id);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đang tải thông tin người dùng...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm font-medium text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Không tìm thấy người dùng.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-7">
      <div className="mb-6 pr-12">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          Thông tin người dùng
        </p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
          {user.full_name || "Người dùng"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
      </div>

      <div className="space-y-5">
        <ViewField label="Họ tên" value={user.full_name} icon={<UserRound className="h-5 w-5" />} />
        <ViewField label="Email" value={user.email} icon={<Mail className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ViewField label="Phone" value={user.phone} icon={<Phone className="h-5 w-5" />} />
          <ViewField label="Role" value={user.role || "USER"} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>
        <ViewField
          label="Created"
          value={formatDate(user.created_at)}
          icon={<CalendarClock className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
