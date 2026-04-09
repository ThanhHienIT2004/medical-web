import { useState, useEffect } from 'react';
import { apiClient } from '@/libs/api/apiClient';
import type { Doctor } from '@/types/doctors';
import type { DoctorSchedule } from '@/types/doctorSchedule';
import type { TimeSlot } from '@/app/(guest)/booking/[id]/components/TimeSlotSelector';

export const useBookingData = (doctorId: string, selectedDate: string, selectedScheduleId: number | null) => {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [doctorLoading, setDoctorLoading] = useState(true);
    const [doctorError, setDoctorError] = useState<Error | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [schedulesByDate, setSchedulesByDate] = useState<DoctorSchedule[]>([]);
    const [slots, setSlots] = useState<TimeSlot[]>([]);

    // Fetch doctor info
    useEffect(() => {
        if (!doctorId) return;
        setDoctorLoading(true);
        apiClient<Doctor>(`/doctors/${doctorId}`)
            .then(setDoctor)
            .catch((e: unknown) => {
                setDoctorError(e instanceof Error ? e : new Error('Không thể tải thông tin bác sĩ'));
            })
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
        apiClient<DoctorSchedule[]>(`/doctor-schedules/by-date?doctor_id=${doctorId}&date=${selectedDate}`)
            .then(setSchedulesByDate)
            .catch(() => setSchedulesByDate([]));
    }, [doctorId, selectedDate]);

    // Fetch slots by schedule
    useEffect(() => {
        if (!selectedScheduleId) {
            setSlots([]);
            return;
        }
        apiClient<TimeSlot[]>(`/appointment-slots/schedule/${selectedScheduleId}`)
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
