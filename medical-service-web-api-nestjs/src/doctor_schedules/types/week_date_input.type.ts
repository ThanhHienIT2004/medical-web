import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class WeekDateInput {
  @Field(() => String)
  @IsNotEmpty()
  start_week!: string;

  @Field(() => String)
  @IsNotEmpty()
  end_week!: string;
}