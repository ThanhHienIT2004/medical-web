import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsDate, Min } from 'class-validator';
import { DoctorSchedule } from '../../doctor_schedules/types/doctor_schedules.model';

@ObjectType()
export class AppointmentSlot {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  @IsNotEmpty()
  schedule_id: number;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_time: Date;

  @Field(() => Int, { defaultValue: 6 })
  @IsInt()
  @Min(1)
  max_patients: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  booked_count: number;

  @Field(() => Date)
  created_at: Date;

  @Field(() => DoctorSchedule, { nullable: true })
  schedule?: DoctorSchedule;
} 