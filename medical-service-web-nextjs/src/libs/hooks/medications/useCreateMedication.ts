import { useState } from 'react';
import { CreateMedicationInput, Medication } from "@/types/medications";
import { apiClient } from "@/libs/api/apiClient";

export function useCreateMedication() {
	const [data, setData] = useState<Medication | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const create = async (input: CreateMedicationInput) => {
		try {
			setLoading(true);
			setError(null);
			const result = await apiClient<Medication>('/medications', {
				method: 'POST',
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
		create,
		data,
		loading,
		error,
	};
}