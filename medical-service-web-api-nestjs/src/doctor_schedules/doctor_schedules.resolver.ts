import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  DoctorSchedule,
} from './types/doctor_schedules.model';
import { DoctorScheduleService } from './doctor_schedules.service';
import { CreateDoctorScheduleInput } from './types/doctor_schedules.dto';
import { WeekDateInput } from './types/week_date_input.type';

@Resolver(() => DoctorSchedule)
export class DoctorScheduleResolver {
  constructor(private doctorScheduleService: DoctorScheduleService) {}

  @Query(() => [DoctorSchedule])
  async getDoctorScheduleByWeekDate(
    @Args('weekDate') weekDate: WeekDateInput,
  ): Promise<DoctorSchedule[]> {
    return this.doctorScheduleService.getDoctorScheduleByWeekDate(weekDate);
  }

  @Query(() => [DoctorSchedule])
  async getDoctorSchedulesIdByDate(
    @Args('doctor_id', { type: () => String }) doctor_id: string,
    @Args('date', { type: () => String }) date: string,
  ) {
    return this.doctorScheduleService.findSchedulesByDoctorAndDate(
      doctor_id,
      date,
    );
  }

  @Query(() => [String])
  async getAvailableScheduleDates(
    @Args('doctor_id', { type: () => String }) doctor_id: string,
  ): Promise<string[]> {
    return this.doctorScheduleService.getAvailableScheduleDates(doctor_id);
  }

  @Mutation(() => Boolean)
  async createDoctorSchedule(
    @Args('input') scheduleInput: CreateDoctorScheduleInput,
  ) {
    return this.doctorScheduleService.create(scheduleInput);
  }

  @Mutation(() => Boolean)
  async deleteDoctorSchedule(
    @Args('schedule_id', { type: () => Number }) schedule_id: number,
  ): Promise<boolean> {
    return this.doctorScheduleService.delete(schedule_id);
  }

  @Mutation(() => DoctorSchedule)
  async updateDoctorSchedule(
    @Args('id', { type: () => String }) schedule_id: number,
    @Args('doctorData') doctorData: CreateDoctorScheduleInput,
  ): Promise<DoctorSchedule> {
    return this.doctorScheduleService.update(schedule_id, doctorData);
  }
}