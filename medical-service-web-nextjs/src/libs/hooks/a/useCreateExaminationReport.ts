import { useState } from 'react';
import { MedicalExaminationInput } from "@/types/examination_report";
import { apiClient } from "@/libs/api/apiClient";

export function useCreateExamination() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (input: MedicalExaminationInput): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient('/examination-reports/medical-examination', {
                method: 'POST',
                body: input,
            });
            setData(result);
            return true;
        } catch (e: any) {
            setError(e);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        create,
        loading,
        error,
        data,
    };
}
