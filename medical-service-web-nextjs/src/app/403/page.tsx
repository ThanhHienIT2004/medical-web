"use client";

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">403 - Không có quyền truy cập</h1>
        <p className="mt-2 text-gray-600">
          Bạn không có quyền để truy cập trang này.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900"
          >
            Về trang chủ
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
}

