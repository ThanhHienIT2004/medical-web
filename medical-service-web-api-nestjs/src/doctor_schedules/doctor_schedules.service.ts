import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDoctorScheduleInput,
  ShiftType,
} from './types/doctor_schedules.dto';
import { DoctorSchedule } from './types/doctor_schedules.model';
import { WeekDateInput } from './types/week_date_input.type';

@Injectable()
export class DoctorScheduleService {
  constructor(private prisma: PrismaService) {}

  async getDoctorScheduleByWeekDate(
    weekDate: WeekDateInput,
  ): Promise<DoctorSchedule[]> {
    const startDate = new Date(weekDate.start_week);
    const endDate = new Date(weekDate.end_week);

    return this.prisma.doctorSchedule.findMany({
      where: {
        start_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        doctor: {
          include: { user: true },
        },
      },
    });
  }

  async create(input: CreateDoctorScheduleInput): Promise<boolean> {
    try {
      const doctor = await this.prisma.doctors.findUnique({
        where: { id: input.doctor_id },
      });
      if (!doctor) {
        new Error('Doctor not found');
      }

      const baseDate = new Date(input.date);
      for (let i = 0; i < input.week_count; i++) {
        const startTime = new Date(baseDate);
        const endTime = new Date(baseDate);
        startTime.setDate(baseDate.getDate() + i * 7);
        endTime.setDate(baseDate.getDate() + i * 7);

        switch (input.shift) {
          case ShiftType.MORNING: {
            startTime.setUTCHours(8, 0, 0, 0);
            endTime.setUTCHours(12, 0, 0, 0);
            break;
          }
          case ShiftType.AFTERNOON: {
            startTime.setUTCHours(13, 0, 0, 0);
            endTime.setUTCHours(17, 0, 0, 0);
            break;
          }
          case ShiftType.OVERTIME: {
            startTime.setUTCHours(18, 0, 0, 0);
            endTime.setUTCHours(22, 0, 0, 0);
            break;
          }
          default: {
            new Error('Invalid shift type');
            break;
          }
        }

        const schedule = await this.prisma.doctorSchedule.create({
          data: {
            doctor_id: input.doctor_id,
            day: input.day,
            shift: input.shift,
            start_time: startTime,
            end_time: endTime,
            is_available: true,
          },
        });

        if (!schedule) {
          new Error('Schedule not created');
        }
        const baseStartTime = new Date(startTime);
        const baseEndTime = new Date(startTime);
        baseEndTime.setMinutes(baseEndTime.getMinutes() + 30);
        for (let j = 0; j < 8; j++) {
          const startTime = new Date(baseStartTime);
          startTime.setMinutes(baseStartTime.getMinutes() + j * 30);
          const endTime = new Date(baseEndTime);
          endTime.setMinutes(baseEndTime.getMinutes() + j * 30);
          await this.prisma.appointmentSlot.create({
            data: {
              schedule_id: schedule.id,
              start_time: startTime,
              end_time: endTime,
            }
          })
        }
      }

      return true;

    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  }

  async findSchedulesByDoctorAndDate(doctor_id: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 1);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.doctorSchedule.findMany({
      where: {
        doctor_id,
        OR: [
          {
            start_time: { lte: endOfDay },
            end_time: { gte: startOfDay },
          },
        ],
      },
    });
  }

  async getAvailableScheduleDates(doctor_id: string): Promise<string[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set về đầu ngày

    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctor_id,
        is_available: true,
        start_time: {
          gte: today,
        },
      },
      select: {
        start_time: true,
      },
    });

    const uniqueDates = Array.from(
      new Set(
        schedules.map((s) => s.start_time.toISOString().split('T')[0]), // lấy phần yyyy-mm-dd
      ),
    );

    return uniqueDates.sort(); // sắp xếp tăng dần
  }

  // Xóa lịch
  async delete(id: number): Promise<boolean> {
    await this.prisma.doctorSchedule.delete({
      where: { id },
    });

		return true;
  }

  async update(
    id: number,
    data: CreateDoctorScheduleInput,
  ): Promise<DoctorSchedule> {
    return this.prisma.doctorSchedule.update({
      where: { id },
      data,
      include: {
        doctor: {
          include: { user: true },
        },
      },
    });
  }
}