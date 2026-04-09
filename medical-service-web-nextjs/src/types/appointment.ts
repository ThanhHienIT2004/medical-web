import {Patient} from "@/types/patient";

export type AppointmentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;

export interface Appointment {
    appointment_id: number;
    patient_id: string;
    doctor_id: string;
    slot_id: string;
    appointment_type: string;
    appointment_date: string | number | Date;
    status: AppointmentStatus;
    is_done?: boolean;
    is_anonymous: boolean;
    notes: string;
    patient?: Patient;
    doctor?: {
        user?: {
            full_name?: string;
            avatar?: string;
            email?: string;
            phone?: string;
        };
    };
}

export interface PaginationAppointmentInput{
    doctor_id: string;
    page: number;
    pageSize: number;
}


export interface PaginatedAppointment {
    items: Appointment[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}


export interface CreateAppointmentInput {
    doctor_id: string;
    schedule_id: string;
    appointment_id: string;
    appointment_type: string;
    is_anonymous: boolean;
}

export interface UpdateAppointmentInput {
    appointment_id: number;
    appointment_type?: string;
    appointment_date?: string;
    status?: string;
    is_done?: boolean;
}

export class DeleteAppointmentInput {
    appointment_id: number;
}


