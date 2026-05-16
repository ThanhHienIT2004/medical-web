import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/libs/api/apiClient";
import { User } from "@/types/user";
import { PaginatedResponse, PaginationInput } from "@/types/pagination";

export type UserSortBy = "full_name" | "email" | "created_at";
export type UserSortOrder = "asc" | "desc";

export type GetUsersOptions = {
  search?: string;
  role?: string;
  sortBy?: UserSortBy;
  sortOrder?: UserSortOrder;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function adaptUsersPagination(raw: unknown): PaginatedResponse<User> {
  if (!isRecord(raw)) {
    return { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };
  }

  if ("items" in raw && "page" in raw) {
    return raw as PaginatedResponse<User>;
  }

  const items = (raw.data ?? raw.items ?? []) as User[];
  const total = typeof raw.total === "number" ? raw.total : 0;
  const page =
    typeof raw.currentPage === "number" ? raw.currentPage : typeof raw.page === "number" ? raw.page : 1;
  const pageSize =
    typeof raw.itemsPerPage === "number"
      ? raw.itemsPerPage
      : typeof raw.pageSize === "number"
        ? raw.pageSize
        : 10;
  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 10)));

  return { items, total, page, pageSize, totalPages };
}

export function useGetUsers(initialPage = 1, initialLimit = 10, options: GetUsersOptions = {}) {
  const [input, setInput] = useState<PaginationInput>({ page: initialPage, limit: initialLimit });
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { search = "", role = "", sortBy = "created_at", sortOrder = "desc" } = options;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(input.page),
        limit: String(input.limit),
        sortBy,
        sortOrder,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (role.trim()) {
        params.set("role", role.trim());
      }

      try {
        const result = await apiClient(`/users?${params.toString()}`);
        setData(adaptUsersPagination(result));
      } catch {
        const fallbackResult = await apiClient(`/users?page=${input.page}&limit=${input.limit}`);
        setData(adaptUsersPagination(fallbackResult));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải danh sách người dùng"));
    } finally {
      setLoading(false);
    }
  }, [input.page, input.limit, role, search, sortBy, sortOrder]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const goToPage = (page: number) => setInput((p) => ({ ...p, page }));
  const setPageSize = (limit: number) => setInput({ page: 1, limit });

  return {
    input,
    users: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || initialLimit,
    totalPages: data?.totalPages || 1,
    loading,
    error,
    refetch: fetchUsers,
    goToPage,
    setPageSize,
  };
}

export function useGetUser(id?: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async (userId?: string | null) => {
    if (!userId) return null;
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<User>(`/users/${userId}`);
      setUser(result);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải thông tin người dùng"));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUser(id);
  }, [id, fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}

export function useGetUserByEmail() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchByEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<User>(`/users/email/${encodeURIComponent(email)}`);
      setUser(result);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Không thể tải người dùng theo email"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, fetchByEmail };
}

export function useUpdateUser() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, payload: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<User>(`/users/${id}`, { method: "PATCH", body: payload });
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Cập nhật người dùng thất bại"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, data, loading, error };
}

export type CreateUserPayload = Pick<User, "email" | "full_name"> &
  Partial<Pick<User, "phone" | "role">> & {
    password: string;
  };

export function useCreateUser() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (payload: CreateUserPayload) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<User>("/auth/register", {
        method: "POST",
        body: payload,
        skipAuth: true,
      });
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Tạo người dùng thất bại"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, data, loading, error };
}

export function useDeleteUser() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<User>(`/users/${id}`, { method: "DELETE" });
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Xóa người dùng thất bại"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, data, loading, error };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<boolean>("/users/forgot-password", { method: "POST", body: { email } });
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Gửi mã xác nhận thất bại"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = async (email: string, otp: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient<boolean>("/users/reset-password", {
        method: "POST",
        body: { email, otp, newPassword },
        skipAuth: true,
      });
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error("Đặt lại mật khẩu thất bại"));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reset, loading, error };
}
