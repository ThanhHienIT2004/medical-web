import { useState } from 'react';
import { UpdateDoctorInput } from "@/types/doctors";
import { apiClient } from "@/libs/api/apiClient";

export interface UpdateDoctorResponse {
	id: string;
	user: {
		id: string;
		email?: string | null;
		full_name?: string | null;
		gender?: "MALE" | "FEMALE" | "OTHER" | null;
	};
	qualifications?: string | null;
	work_seniority?: number | null;
	specialty?: string | null;
	hospital?: string | null;
}

export function useUpdateDoctor() {
	const [data, setData] = useState<UpdateDoctorResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const update = async (id: string, doctorData: UpdateDoctorInput) => {
		try {
			setLoading(true);
			setError(null);
			const result = await apiClient<UpdateDoctorResponse>(`/doctors/${id}`, {
				method: 'PATCH',
				body: doctorData,
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
