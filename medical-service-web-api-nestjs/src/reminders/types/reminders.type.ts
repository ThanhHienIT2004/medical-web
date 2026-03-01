// 📁 reminder/reminder.model.ts
import { ObjectType, Field, Int, InputType, PartialType } from '@nestjs/graphql';
import { Patient } from '../../patients/types/patients.type';

@ObjectType()
export class Reminder {
  @Field(() => Int)
  reminder_id: number;

  @Field()
  patient_id: string;

  @Field()
  reminder_type: string;

  @Field()
  reminder_time: Date;

  @Field({ nullable: true })
  message?: string;

  @Field()
  status: string;

  @Field()
  created_at: Date;

  @Field(() => Patient)
  patient: Patient;
}

@InputType()
export class CreateReminderInput {
  @Field()
  patient_id: string;

  @Field()
  reminder_type: string;

  @Field()
  reminder_time: Date;

  @Field({ nullable: true })
  message?: string;
}

@InputType()
export class UpdateReminderInput extends PartialType(CreateReminderInput) {
  @Field(() => Int)
  reminder_id: number;

  @Field({ nullable: true })
  status?: string;
}