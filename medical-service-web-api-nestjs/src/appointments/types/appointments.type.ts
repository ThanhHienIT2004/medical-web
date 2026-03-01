import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLTimestamp } from 'graphql-scalars';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Patient } from '../../patients/types/patients.type';
import { Doctor } from 'src/doctors/type/doctors.model';

@ObjectType()
export class Appointment {
  @Field(() => ID)
  appointment_id: number;

  @Field(() => String)
  patient_id: string;

  @Field(() => String)
  doctor_id: string;

  @Field(() => Int)
  slot_id: number;

  @Field(() => String)
  appointment_type: string;

  @Field(() => GraphQLTimestamp)
  appointment_date: Date;

  @Field(() => String)
  status: string;

  @Field(() => Boolean)
  is_anonymous: boolean;

  @Field(() => String,{nullable : true})
  notes?: string | null;

  @Field(() => GraphQLTimestamp)
  created_at: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  updated_at?: Date | null;

  @Field(() => Patient)
  patient: Patient;

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor;
}

@InputType()
export class PaginationAppointmentInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => String, { nullable: true })
  doctor_id: string;
}


@ObjectType()
export class PaginatedAppointment {
  @Field(() => [Appointment])
  items: Appointment[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}

@InputType()
export class CreateAppointmentInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  slot_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  appointment_type: string;

  @Field(() => GraphQLTimestamp)
  @IsNotEmpty()
  appointment_date: Date;

  @Field(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  is_anonymous?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  notes?: string | null;
}

@InputType()
export class UpdateAppointmentInput {
  @Field(() => Int)
  appointment_id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_done?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  appointment_type?: string;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  appointment_date?: Date;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  is_anonymous?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  notes?: string;


}

@InputType()
export class UpdateAppointmentStatusInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'COMPLETED', 'CANCELLED'], { message: 'Trạng thái phải là PENDING, COMPLETED hoặc CANCELLED' })
  status: string;
}

@InputType()
export class GetAppointmentByIdInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;
}

@InputType()
export class GetAppointmentByPatientIdInput {
  @Field(() => String)
  @IsString({ message: 'patient_id phải là chuỗi' })
  @IsNotEmpty({ message: 'patient_id không được để trống' })
  patient_id: string;
}

@InputType()
export class DeleteAppointmentInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  appointment_id: number;
}
