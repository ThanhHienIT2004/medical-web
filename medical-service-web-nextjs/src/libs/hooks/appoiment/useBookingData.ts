import { useState, useEffect } from 'react';
import { apiClient } from '@/libs/api/apiClient';

export const useBookingData = (doctorId: string, selectedDate: string, selectedScheduleId: number | null) => {
    const [doctor, setDoctor] = useState<any>(null);
    const [doctorLoading, setDoctorLoading] = useState(true);
    const [doctorError, setDoctorError] = useState<Error | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [schedulesByDate, setSchedulesByDate] = useState<any[]>([]);
    const [slots, setSlots] = useState<any[]>([]);

    // Fetch doctor info
    useEffect(() => {
        if (!doctorId) return;
        setDoctorLoading(true);
        apiClient(`/doctors/${doctorId}`)
            .then(setDoctor)
            .catch(setDoctorError)
            .finally(() => setDoctorLoading(false));
    }, [doctorId]);

    // Fetch available dates
    useEffect(() => {
        if (!doctorId) return;
        apiClient<string[]>(`/doctor-schedules/available-dates/${doctorId}`)
            .then(setAvailableDates)
            .catch(() => setAvailableDates([]));
    }, [doctorId]);

    // Fetch schedules by date
    useEffect(() => {
        if (!selectedDate || !doctorId) return;
        apiClient(`/doctor-schedules/by-date?doctor_id=${doctorId}&date=${selectedDate}`)
            .then(setSchedulesByDate)
            .catch(() => setSchedulesByDate([]));
    }, [doctorId, selectedDate]);

    // Fetch slots by schedule
    useEffect(() => {
        if (!selectedScheduleId) {
            setSlots([]);
            return;
        }
        apiClient(`/appointment-slots/schedule/${selectedScheduleId}`)
            .then(setSlots)
            .catch(() => setSlots([]));
    }, [selectedScheduleId]);

    return {
        doctor,
        doctorLoading,
        doctorError,
        availableDates,
        schedulesByDate,
        slots,
    };
};
