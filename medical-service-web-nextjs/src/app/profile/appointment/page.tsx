'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
    CalendarCheck,
    Clock,
    Stethoscope,
    Eye,
    XCircle,
} from 'lucide-react';
import AppointmentDetailModal from './AppointmentDetailModal';
import { useSnackbar } from 'notistack';
import { apiClient } from '@/libs/api/apiClient';

export default function AppointmentsPage() {
    const { data: session, status } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const patientId = session?.user?.id;

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = useCallback(async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            const result = await apiClient(`/appointments/patient/${patientId}`);
            setAppointments(Array.isArray(result) ? result : []);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleOpenModal = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAppointment(null);
        setIsModalOpen(false);
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        if (confirm('Bạn có chắc muốn hủy lịch hẹn này không?')) {
            try {
                await apiClient(`/appointments/${parseInt(appointmentId)}/status`, {
                    method: 'PATCH',
                    body: { status: 'CANCELLED' },
                });
                enqueueSnackbar('Đã hủy lịch hẹn thành công!', { variant: 'success' });
                await fetchAppointments();
            } catch (err: any) {
                enqueueSnackbar('Lỗi khi hủy lịch: ' + err.message, { variant: 'error' });
            }
        }
    };

    const statusColor: Record<string, string> = {
        'Đang chờ': 'bg-amber-100 text-amber-800 ring-amber-200',
        'Đã hoàn thành': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
        'Đã hủy': 'bg-rose-100 text-rose-800 ring-rose-200',
        'PENDING': 'bg-amber-100 text-amber-800 ring-amber-200',
        'COMPLETED': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
        'CANCELLED': 'bg-rose-100 text-rose-800 ring-rose-200',
    };

    const statusText: Record<string, string> = {
        'Đang chờ': 'Đang chờ',
        'PENDING': 'Đang chờ',
        'Đã hoàn thành': 'Đã hoàn thành',
        'COMPLETED': 'Đã hoàn thành',
        'Đã hủy': 'Đã hủy',
        'CANCELLED': 'Đã hủy',
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 text-gray-600 animate-pulse">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-lg font-medium">Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-lg flex items-center gap-3">
                    <XCircle className="h-6 w-6" />
                    <p className="text-lg font-medium">Lỗi: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <CalendarCheck className="h-8 w-8 text-indigo-600" />
                    Quản lý lịch hẹn
                </h1>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {appointments?.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-lg font-medium">Không có lịch hẹn nào.</p>
                            <p className="text-gray-400 mt-2">Hãy đặt lịch hẹn mới để bắt đầu!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {appointments.map((appt: any) => {
                                const dt = typeof appt.appointment_date === 'number'
                                    ? new Date(appt.appointment_date)
                                    : new Date(appt.appointment_date);
                                const formattedDate = dt.toISOString().slice(0, 10);
                                const formattedTime = dt.toISOString().slice(11, 16);

                                return (
                                    <div
                                        key={`appt-${appt.appointment_id}`}
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 hover:bg-gray-50 transition-all duration-300 ease-in-out group"
                                    >

                                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                                            <div className="flex items-center gap-3 text-gray-900 font-semibold">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                                <span>{formattedDate} lúc {formattedTime}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Stethoscope className="h-5 w-5 text-indigo-600" />
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={appt.doctor?.user?.avatar}
                                                        alt="Avatar bác sĩ"
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                    <span>Bác sĩ: <span className="font-medium">{appt.doctor?.user?.full_name || 'Chưa xác định'}</span></span>
                                                </div>
                                            </div>
                                            <div
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor[appt.status] || 'bg-gray-100 text-gray-700'} ring-1 ring-inset`}
                                            >
                                                {statusText[appt.status] || appt.status}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-4 sm:mt-0">
                                            {(appt.status === 'Đang chờ' || appt.status === 'PENDING') && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appt.appointment_id)}
                                                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200 group-hover:scale-105"
                                                    title="Hủy lịch hẹn"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                    <span>Hủy</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenModal(appt)}
                                                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 group-hover:scale-105"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="h-5 w-5" />
                                                <span>Chi tiết</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedAppointment && (
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
