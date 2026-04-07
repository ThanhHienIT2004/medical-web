import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLDate } from 'graphql-scalars';
import { Days, ShiftType } from './doctor_schedules.dto';
import { Doctor } from '../../doctors/type/doctors.model';

@ObjectType()
export class DoctorSchedule {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  doctor_id: string;

  @Field(() => String)
  day: string;

  @Field(() => String)
  shift: string;

  @Field(() => Date)
  start_time: Date;

  @Field(() => Date)
  end_time: Date;

  @Field(() => Boolean, { nullable: true })
  is_available: boolean | null;

  @Field(() => Date, { description: 'Creation date of the user record' })
  created_at: Date;

  @Field(() => Doctor, { nullable: false })
  doctor: Doctor;
}