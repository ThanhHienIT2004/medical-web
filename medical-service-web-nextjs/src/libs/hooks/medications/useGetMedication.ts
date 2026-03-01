import { useState, useEffect, useCallback } from 'react';
import { Medication } from "@/types/medications";
import { apiClient } from "@/libs/api/apiClient";

export function useGetMedication(id: number) {
	const [data, setData] = useState<Medication | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchMedication = useCallback(async () => {
		if (!id && id !== 0) return;
		try {
			setLoading(true);
			const result = await apiClient<Medication>(`/medications/${id}`);
			setData(result);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchMedication();
	}, [fetchMedication]);

	return {
		medication: data,
		loading,
		error,
		refetch: fetchMedication,
	};
}
