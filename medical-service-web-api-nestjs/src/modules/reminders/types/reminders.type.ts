// 📁 reminder/reminder.model.ts
import { ObjectType, Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Patient } from '../../patients/types/patients.type';

@ObjectType()
export class Reminder {
  @Field(() => ID)
  reminder_id: string;

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
  @Field(() => ID)
  reminder_id: string;

  @Field({ nullable: true })
  status?: string;
}