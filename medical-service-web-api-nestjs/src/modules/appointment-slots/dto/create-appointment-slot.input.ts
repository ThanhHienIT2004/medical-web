import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsOptional, IsInt, Min } from 'class-validator';

@InputType()
export class CreateAppointmentSlotInput {
  @Field(() => ID)
  @IsNotEmpty()
  schedule_id: string;

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
  @IsOptional()
  max_patients: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  booked_count?: number;

} 