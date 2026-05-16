"use client";

import React, { useEffect, useState } from "react";
import { useCreateUser, useGetUser, useUpdateUser } from "@/features/users/hooks/useUsers";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Check, Lock, Mail, Phone, ShieldCheck, UserRound, X } from "lucide-react";

interface Props {
  id?: string;
  mode?: "create" | "edit";
  onClose: () => void;
  onSaved?: () => void;
}

type UserFormState = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

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
      <Label>{label}</Label>
      <div className="relative">
        {children}
        <span className="absolute left-0 top-1/2 flex h-11 w-[54px] -translate-y-1/2 items-center justify-center border-r border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

function SelectWithIcon({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[68px] pr-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="USER">USER</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <span className="absolute left-0 top-1/2 flex h-11 w-[54px] -translate-y-1/2 items-center justify-center border-r border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {icon}
        </span>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function UserForm({ id, mode = "edit", onClose, onSaved }: Props) {
  const isCreate = mode === "create";
  const { user, loading, error, refetch } = useGetUser(isCreate ? null : id);
  const { update, loading: updating, error: updateError } = useUpdateUser();
  const { create, loading: creating, error: createError } = useCreateUser();

  const [form, setForm] = useState<UserFormState>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "USER",
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreate) {
        await create({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        });
      } else if (id) {
        await update(id, {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        });
        await refetch(id);
      }
      onSaved?.();
      onClose();
    } catch {
      // Error state is handled in the hook/toast flow.
    }
  };

  return (
    <div className="p-6 sm:p-7">
      <div className="mb-6 pr-12">
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          {isCreate ? "Tạo người dùng" : "Chỉnh sửa người dùng"}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
          {isCreate ? "Người dùng mới" : user?.full_name || "Người dùng"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isCreate
            ? "Thêm tài khoản mới với thông tin đăng nhập cơ bản."
            : "Cập nhật thông tin liên hệ và tên hiển thị."}
        </p>
      </div>

      {!isCreate && loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải thông tin người dùng...</p>
      ) : error ? (
        <p className="text-sm font-medium text-red-600">{error.message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {(createError || updateError) && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {(createError || updateError)?.message}
            </p>
          )}

          <InputWithIcon label="Họ tên" icon={<UserRound className="h-5 w-5" />}>
            <Input
              value={form.full_name}
              onChange={(e) => setForm((current) => ({ ...current, full_name: e.target.value }))}
              placeholder="Nhập họ tên"
              className="pl-[68px]"
              required
            />
          </InputWithIcon>

          <InputWithIcon label="Email" icon={<Mail className="h-5 w-5" />}>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              placeholder="info@gmail.com"
              className="pl-[68px]"
              required
            />
          </InputWithIcon>

          {isCreate && (
            <InputWithIcon label="Mật khẩu" icon={<Lock className="h-5 w-5" />}>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                placeholder="Nhập mật khẩu"
                className="pl-[68px]"
                required
                minLength={6}
              />
            </InputWithIcon>
          )}

          <InputWithIcon label="Phone" icon={<Phone className="h-5 w-5" />}>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
              className="pl-[68px]"
            />
          </InputWithIcon>

          <SelectWithIcon
            label="Role"
            value={form.role}
            onChange={(value) => setForm((current) => ({ ...current, role: value }))}
            icon={<ShieldCheck className="h-5 w-5" />}
          />

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
              disabled={updating || creating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Check className="h-4 w-4" />
              {updating || creating
                ? "Đang lưu..."
                : isCreate
                  ? "Tạo người dùng"
                  : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
