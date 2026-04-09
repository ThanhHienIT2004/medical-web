import { useState, useEffect, useCallback } from 'react';
import { Doctor } from "@/types/doctors";
import { apiClient } from "@/libs/api/apiClient";

export function useGetDoctor(id: string) {
	const [data, setData] = useState<Doctor | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchDoctor = useCallback(async () => {
		if (!id) return;
		try {
			setLoading(true);
			const doctor = await apiClient<Doctor>(`/doctors/${id}`);
			setData(doctor);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchDoctor();
	}, [fetchDoctor]);

	return {
		doctor: data,
		loading,
		error,
		refetch: fetchDoctor,
	};
}
