import { useState, useEffect, useCallback } from 'react';
import { Medication } from "@/types/medications";
import { PaginatedResponse, PaginationInput } from "@/types/pagination";
import { apiClient } from "@/libs/api/apiClient";

export function useGetMedications(page = 1, limit = 20) {
	const [paginationInput, setPaginationInput] = useState<PaginationInput>({
		page: page,
		limit: limit,
	});
	const [data, setData] = useState<PaginatedResponse<Medication> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchMedications = useCallback(async () => {
		try {
			setLoading(true);
			const result = await apiClient<PaginatedResponse<Medication>>(
				`/medications?page=${paginationInput.page}&limit=${paginationInput.limit}`
			);
			setData(result);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [paginationInput.page, paginationInput.limit]);

	useEffect(() => {
		fetchMedications();
	}, [fetchMedications]);

	const goToPage = (page: number) => {
		setPaginationInput((prev) => ({ ...prev, page }));
	};

	const setPageSize = (limit: number) => {
		setPaginationInput((prev) => ({ ...prev, limit, page: 1 }));
	};

	return {
		input: paginationInput,
		medications: data?.items || [],
		total: data?.total || 0,
		page: data?.page || 1,
		pageSize: data?.pageSize || 10,
		totalPage: data?.totalPages || 1,
		loading,
		error,
		refetch: fetchMedications,
		goToPage,
		setPageSize,
	};
}