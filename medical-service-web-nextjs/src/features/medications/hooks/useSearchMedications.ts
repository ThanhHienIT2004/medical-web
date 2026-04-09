import { useState, useEffect, useCallback } from 'react';
import { Medication } from "@/types/medications";
import { apiClient } from "@/libs/api/apiClient";

export function useSearchMedications(keyword: string) {
	const [medications, setMedications] = useState<Medication[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchSearch = useCallback(async () => {
		if (!keyword) {
			setMedications([]);
			return;
		}
		try {
			setLoading(true);
			const result = await apiClient<Medication[]>(
				`/medications/search?keyword=${encodeURIComponent(keyword)}`
			);
			setMedications(result);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [keyword]);

	useEffect(() => {
		fetchSearch();
	}, [fetchSearch]);

	return {
		medications,
		loading,
		error,
		refetch: fetchSearch,
	};
}