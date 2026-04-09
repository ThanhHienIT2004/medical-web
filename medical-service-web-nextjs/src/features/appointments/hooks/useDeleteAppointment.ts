import { useState } from 'react';
import { apiClient } from "@/libs/api/apiClient";

export function useDeleteAppointment() {
    const [data, setData] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const remove = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient(`/appointments/${id}`, { method: 'DELETE' });
            setData(result);
            return result;
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error('Không thể xóa lịch hẹn');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        delete: remove,
        data,
        loading,
        error,
    };
}
