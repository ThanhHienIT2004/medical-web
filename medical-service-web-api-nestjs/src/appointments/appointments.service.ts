import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment as PrismaAppointment } from '@prisma/client';
import { CreateAppointmentInput, PaginatedAppointment, UpdateAppointmentInput } from './types/appointments.type';
import { EmailService } from '../api/send-email/email.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async create(input: CreateAppointmentInput): Promise<PrismaAppointment> {
    // Bước 1: Kiểm tra trùng lịch
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctor_id: input.doctor_id,
        appointment_date: input.appointment_date,
      },
    });

    if (existingAppointment) {
      throw new Error('Đã có lịch hẹn vào thời gian này. Vui lòng chọn khung giờ khác.');
    }

    // Bước 2: Tạo appointment
    const appointment = await this.prisma.appointment.create({
      data: { ...input },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    // ✅ Bước 2.5: Tăng booked_count trong slot
    await this.prisma.appointmentSlot.update({
      where: { id: input.slot_id },
      data: {
        booked_count: {
          increment: 1,
        },
      },
    });

    // Bước 3: Gửi email xác nhận
    const patientEmail = appointment.patient.user.email;
    const patientName = appointment.patient.user.full_name;
    const doctorName = appointment.doctor.user.full_name;
    const appointmentDateTime = new Date(appointment.appointment_date);
    const formattedDateTime = appointmentDateTime.toISOString().slice(0, 19).replace('T', ' ');
    const [date, time] = formattedDateTime.split(' ');

    try {
      await this.emailService.sendAppointmentConfirmation(patientEmail, {
        patientName,
        appointmentDate: date,
        appointmentTime: time,
        doctorName,
        clinicName: 'Phòng khám Quận 12',
      });
    } catch (emailError) {
      console.warn('Gửi email thất bại:', emailError.message);
    }

    return appointment;
  }

  async updateStatus(appointmentId: number, newStatus: string): Promise<PrismaAppointment> {
    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`);
    }

    // Kiểm tra appointment tồn tại
    const appointment = await this.prisma.appointment.findUnique({
      where: { appointment_id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment #${appointmentId} not found`);
    }

    // Cập nhật trạng thái
    const updatedAppointment = await this.prisma.appointment.update({
      where: { appointment_id: appointmentId },
      data: { status: newStatus },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });

    return updatedAppointment;
  }

  async findAllByDoctorId(
    doctorId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedAppointment> {
    const skip = (page - 1) * pageSize;

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where: { doctor_id: doctorId },
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include:{
          patient:{
            include:{
              user: true,
            }
          }
        }
      }),
      this.prisma.appointment.count({
        where: { doctor_id: doctorId },
      }),
    ]);

    return {
      items: appointments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async getAppointmentByPatientId(id: string): Promise<PrismaAppointment[]> {
    return this.prisma.appointment.findMany({
      where: { patient_id: id },
      orderBy: { appointment_date: 'desc' },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<PrismaAppointment[]> {
    return this.prisma.appointment.findMany({
      orderBy: { appointment_date: 'asc' },
    });
  }

  async findOne(id: number): Promise<PrismaAppointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { appointment_id: id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  async update(input: UpdateAppointmentInput): Promise<PrismaAppointment> {
    return this.prisma.appointment.update({
      where: { appointment_id: input.appointment_id },
      data: {
        status: input.status,
        is_done:input.is_done,
      },
    });
  }


  async remove(id: number): Promise<PrismaAppointment> {
    await this.findOne(id);
    return this.prisma.appointment.delete({
      where: { appointment_id: id },
    });
  }
}