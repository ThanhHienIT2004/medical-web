import type { DoctorSchedule } from "@/types/doctorSchedule";

export type AppointmentSlot = {
  id: string;
  schedule_id: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  booked_count: number;
  schedule?: DoctorSchedule;
};

export type CreateAppointmentSlotInput = {
  schedule_id: string;
  start_time: string; // ISO
  end_time: string; // ISO
  max_patients?: number;
  booked_count?: number;
};

export type UpdateAppointmentSlotInput = Partial<CreateAppointmentSlotInput>;

