import { useState } from 'react';
import { CreateDoctorScheduleData } from "@/types/doctorSchedule";
import { apiClient } from "@/libs/api/apiClient";

export function useCreateDoctorSchedule() {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const createSchedule = async (input: CreateDoctorScheduleData) => {
		try {
			setLoading(true);
			setError(null);
			const result = await apiClient('/doctor-schedules', {
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
		create: createSchedule,
		data,
		loading,
		error,
	};
}