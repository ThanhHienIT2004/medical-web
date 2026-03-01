import { useState } from 'react';
import { Doctor } from "@/types/doctors";
import { apiClient } from "@/libs/api/apiClient";

export function useDeleteDoctor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteFn = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient(`/doctors/${id}`, { method: 'DELETE' });
            setData(result);
            return result;
        } catch (e: any) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return {
        delete: deleteFn,
        data,
        loading,
        error,
    };
}