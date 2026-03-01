import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLTimestamp } from 'graphql-scalars';
import {IsOptional, IsString } from 'class-validator';

@ObjectType()
export class TreatmentPlan {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => GraphQLTimestamp, { nullable: true })
  hiv_diagnosis_date?: Date;

  @Field(() => GraphQLTimestamp)
  start_date: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  end_date?: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => GraphQLTimestamp)
  created_at: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  updated_at?: Date;
}

@ObjectType()
export class PatientPlanResponse {
  @Field()
  patient_id: string;

  @Field({ nullable: true })
  plan_id?: number;

  @Field(() => TreatmentPlan, { nullable: true })
  plan?: TreatmentPlan;
}


@InputType()
export class CreateTreatmentPlanInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  hiv_diagnosis_date?: Date;

  @Field(() => GraphQLTimestamp)
  start_date: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  end_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateTreatmentPlanInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  hiv_diagnosis_date?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  start_date?: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  @IsOptional()
  end_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
