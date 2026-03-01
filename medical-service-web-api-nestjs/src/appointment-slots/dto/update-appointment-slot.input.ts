import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsDate, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateAppointmentSlotInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  schedule_id: number;

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