"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUser, useUpdateUser } from '@/features/users/hooks/useUsers';
import { useParams } from 'next/navigation';

export default function UserEditPage() {
  const params = useParams();
  const id = (params as any)?.id as string | undefined;
  const { user, loading, error, refetch } = useGetUser(id ?? null);
  const { update, loading: updating } = useUpdateUser();
  const router = useRouter();

  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await update(id, form);
      await refetch(id);
      router.back();
    } catch (e) {
      // handled in hook
    }
  };

  if (!id) return <div>ID không hợp lệ</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-4">Sửa người dùng</h2>

      {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error.message}</div> : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Họ tên</label>
            <input value={form.full_name} onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))} className="mt-1 w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="mt-1 w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="mt-1 w-full" />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={updating} className="btn btn-primary">Lưu</button>
            <button type="button" onClick={() => router.back()} className="btn">Hủy</button>
          </div>
        </form>
      )}
    </div>
  );
}
