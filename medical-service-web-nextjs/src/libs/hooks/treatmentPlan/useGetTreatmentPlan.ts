import { useState, useCallback } from 'react';
import { apiClient } from "@/libs/api/apiClient";

export function useGetTreatmentPlan(patient_id: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetchById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient(`/treatment-plans/${id}`);
            setData(result);
            return result;
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        patient: data,
        plan: data?.plan,
        loading,
        error,
        refetchById,
    };
}
