import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppointmentSlot } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentSlotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AppointmentSlot[]> {
    return this.prisma.appointmentSlot.findMany({
      include: {
        schedule: true,
      },
    });
  }

  async findByScheduleId(schedule_id: number): Promise<AppointmentSlot[]> {
    return this.prisma.appointmentSlot.findMany({
      where: { schedule_id },
      include: {
        schedule: true,
      },
    });
  }

  async findOne(id: number): Promise<AppointmentSlot> {
    const slot = await this.prisma.appointmentSlot.findUnique({
      where: { id },
      include: {
        schedule: true,
      },
    });

    if (!slot) {
      throw new NotFoundException(`Appointment slot with id ${id} not found`);
    }

    return slot;
  }

  async create(data: {
    schedule_id: number;
    start_time: Date;
    end_time: Date;
    max_patients?: number;
    booked_count?: number;
  }): Promise<AppointmentSlot> {
    // Kiểm tra xem schedule có tồn tại không
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { id: data.schedule_id },
    });

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }
// Kiểm tra xem thời gian có hợp lệ không
    if (data.start_time < schedule.start_time || data.end_time > schedule.end_time) {
      throw new BadRequestException('Slot time must be within schedule time');
    }

// Kiểm tra trùng khoảng thời gian trong cùng schedule
    const overlapping = await this.prisma.appointmentSlot.findFirst({
      where: {
        schedule_id: data.schedule_id,
        OR: [
          {
            start_time: { lt: data.end_time },
            end_time: { gt: data.start_time },
          },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Slot time overlaps with another slot in the same schedule');
    }

    // Kiểm tra xem thời gian có hợp lệ không
    if (data.start_time < schedule.start_time || data.end_time > schedule.end_time) {
      throw new BadRequestException('Slot time must be within schedule time');
    }

    return this.prisma.appointmentSlot.create({
      data,
      include: {
        schedule: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      schedule_id?: number;
      start_time?: Date;
      end_time?: Date;
      max_patients?: number;
      booked_count?: number;
    },
  ): Promise<AppointmentSlot> {
    const slot = await this.findOne(id);
    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    // Nếu cập nhật schedule_id, kiểm tra schedule mới
    if (data.schedule_id) {
      const schedule = await this.prisma.doctorSchedule.findUnique({
        where: { id: data.schedule_id },
      });
      if (!schedule) {
        throw new BadRequestException('Schedule not found');
      }
    }

    // Kiểm tra booked_count không vượt quá max_patients
    if (data.booked_count && data.booked_count > (data.max_patients || slot.max_patients)) {
      throw new BadRequestException('Booked count cannot exceed max patients');
    }

    return this.prisma.appointmentSlot.update({
      where: { id },
      data,
      include: {
        schedule: true,
      },
    });
  }

  async delete(id: number): Promise<AppointmentSlot> {
    const slot = await this.findOne(id);
    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    // Kiểm tra xem slot có đang được sử dụng trong appointments không
    const appointments = await this.prisma.appointment.findMany({
      where: { slot_id: id },
    });

    if (appointments.length > 0) {
      throw new BadRequestException('Cannot delete slot that has appointments');
    }

    return this.prisma.appointmentSlot.delete({
      where: { id },
      include: {
        schedule: true,
      },
    });
  }
} 