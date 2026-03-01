import { useState, useEffect, useCallback } from 'react';
import { Doctor, DoctorDisplay } from "@/types/doctors";
import { apiClient } from "@/libs/api/apiClient";

export function useGetDoctors() {
	const [data, setData] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchDoctors = useCallback(async () => {
		try {
			setLoading(true);
			const doctors = await apiClient<Doctor[]>('/doctors');
			setData(doctors);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDoctors();
	}, [fetchDoctors]);

	const doctorsDisplay: DoctorDisplay[] = data
		? data.map((doctor) => ({
			id: doctor.id || null,
			email: doctor.user?.email || "",
			full_name: doctor.user?.full_name || "",
			phone: doctor.user?.phone || "",
			address: doctor.user?.address || "",
			avatar: doctor.user?.avatar || "",
			date_of_birth: doctor.user?.date_of_birth || "",
			qualifications: doctor.qualifications || null,
			work_seniority: doctor.work_seniority || null,
			gender: doctor.gender || null,
			specialty: doctor.specialty || null,
			hospital: doctor.hospital || null,
		}))
		: [];

	return {
		doctors: doctorsDisplay,
		loading,
		error,
		refetch: fetchDoctors,
	};
}