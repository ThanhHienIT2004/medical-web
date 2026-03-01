import { useState } from 'react';
import { apiClient } from "@/libs/api/apiClient";

export function useUpdateAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const update = async (input: { appointment_id: number; status?: string; is_done?: boolean }) => {
        try {
            setLoading(true);
            setError(null);
            await apiClient(`/appointments/${input.appointment_id}`, {
                method: 'PATCH',
                body: { status: input.status, is_done: input.is_done },
            });
        } catch (e: any) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}
