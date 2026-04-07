import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsOptional, IsDate, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateAppointmentSlotInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  schedule_id: string;

  @Field(() => Date)
  @IsDate()
  @IsOptional()
  start_time?: Date;

  @Field(() => Date)
  @IsDate()
  @IsOptional()
  end_time?: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  max_patients?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  booked_count?: number;

}