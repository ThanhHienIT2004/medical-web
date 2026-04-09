import { useState } from 'react';
import { Medication, UpdateMedicationInput } from "@/types/medications";
import { apiClient } from "@/libs/api/apiClient";

export function useUpdateMedication() {
	const [data, setData] = useState<Medication | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const update = async (id: number, input: UpdateMedicationInput) => {
		try {
			setLoading(true);
			setError(null);
			const result = await apiClient<Medication>(`/medications/${id}`, {
				method: 'PATCH',
				body: input,
			});
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
		update,
		data,
		loading,
		error,
	};
}