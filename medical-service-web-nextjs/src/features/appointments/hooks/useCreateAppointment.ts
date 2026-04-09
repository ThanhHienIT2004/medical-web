import { useState } from 'react';
import { Appointment, CreateAppointmentInput } from "@/types/appointment";
import { apiClient } from "@/libs/api/apiClient";

export function useCreateAppointment() {
    const [data, setData] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (input: CreateAppointmentInput) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient<Appointment>('/appointments', {
                method: 'POST',
                body: input,
            });
            setData(result);
            return result;
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error('Không thể tạo lịch hẹn');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        data,
        loading,
        error,
    };
}