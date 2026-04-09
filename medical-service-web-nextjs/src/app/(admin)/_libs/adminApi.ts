import { apiClient } from "@/libs/api/apiClient";
import type { Doctor } from "@/types/doctors";

// Nơi tập trung các call admin (list/detail/CRUD) để page không phải tự build URL nhiều lần.
// Sẽ mở rộng dần theo từng module.

export const adminApi = {
  doctors: {
    list: () => apiClient<Doctor[]>("/doctors"),
    detail: (id: string) => apiClient<Doctor>(`/doctors/${id}`),
  },
};

