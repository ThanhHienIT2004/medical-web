import { useState, useCallback } from 'react';
import { apiClient } from "@/libs/api/apiClient";
import type { TreatmentPlan } from "@/types/treatment_plan";

export function useGetTreatmentPlan(patient_id: string) {
    const [data, setData] = useState<{ patient_id?: string; plan_id?: string | null; plan?: TreatmentPlan | null } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refetchById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient<{ patient_id?: string; plan_id?: string | null; plan?: TreatmentPlan | null }>(`/treatment-plans/${id}`);
            setData(result);
            return result;
        } catch (e: unknown) {
            setError(e instanceof Error ? e : new Error('Không thể tải phác đồ điều trị'));
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
