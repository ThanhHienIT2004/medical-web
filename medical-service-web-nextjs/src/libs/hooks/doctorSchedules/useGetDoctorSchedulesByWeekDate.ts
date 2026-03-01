import { useState, useEffect, useCallback } from 'react';
import { DoctorSchedule, WeekDateInput } from "@/types/doctorSchedule";
import { apiClient } from "@/libs/api/apiClient";

export const useGetDoctorSchedulesByWeekDate = (weekDate: WeekDateInput) => {
	const [data, setData] = useState<DoctorSchedule[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchSchedules = useCallback(async () => {
		try {
			setLoading(true);
			const result = await apiClient<DoctorSchedule[]>(
				`/doctor-schedules/week?start_week=${weekDate.start_week}&end_week=${weekDate.end_week}`
			);
			setData(result);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [weekDate.start_week, weekDate.end_week]);

	useEffect(() => {
		fetchSchedules();
	}, [fetchSchedules]);

	return {
		data,
		loading,
		error,
		refetch: fetchSchedules,
	};
};