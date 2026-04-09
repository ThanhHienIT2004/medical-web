import { useState } from 'react';
import { RegisterDoctorInput } from "@/types/register";
import { apiClient } from "@/libs/api/apiClient";

export function useRegisterDoctor() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const register = async (input: RegisterDoctorInput): Promise<boolean> => {
		try {
			setLoading(true);
			setError(null);
			await apiClient('/doctors', { method: 'POST', body: input });
			return true;
		} catch (e: any) {
			setError(e);
			console.error(e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		register,
		loading,
		error,
	};
}
