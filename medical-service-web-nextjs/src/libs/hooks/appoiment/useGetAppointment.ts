import { useState, useEffect, useCallback } from 'react';
import { PaginatedAppointment } from "@/types/appointment";
import { apiClient } from "@/libs/api/apiClient";

export function useGetAppointments(input: { doctor_id: string, page: number; pageSize: number }) {
    const [data, setData] = useState<PaginatedAppointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAppointments = useCallback(async () => {
        if (!input.doctor_id) return;
        try {
            setLoading(true);
            const result = await apiClient<PaginatedAppointment>(
                `/appointments/doctor?doctor_id=${input.doctor_id}&page=${input.page}&pageSize=${input.pageSize}`
            );
            setData(result);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [input.doctor_id, input.page, input.pageSize]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return {
        appointments: data?.items || [],
        total: data?.total || 0,
        page: data?.page || 1,
        pageSize: data?.pageSize || 10,
        totalPages: data?.totalPages || 1,
        loading,
        error,
        refetch: fetchAppointments,
    };
}
