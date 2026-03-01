// --------------------- TYPES ---------------------
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLTimestamp } from 'graphql-scalars';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { CreateExaminationReportInput } from '../../examination-report/types/examination-report';
import { CreateTreatmentPlanInput } from '../../treatment-plan/types/treatmentplan.type';

@ObjectType()
export class Regimen {
  @Field(() => ID)
  id: number;

  @Field()
  care_stage: string;

  @Field()
  regimen_type: string;

  @Field(() => [String])
  medication_list: string[];

  @Field()
  user_guide: string;

  @Field()
  is_default: boolean;

  @Field(() => GraphQLTimestamp)
  created_at: Date;

  @Field(() => GraphQLTimestamp)
  updated_at: Date;
}

@InputType()
export class CreateRegimenInput {
  @Field()
  @IsString()
  care_stage: string;

  @Field()
  @IsString()
  regimen_type: string;

  @Field(() => [String])
  @IsArray()
  medication_list: string[];

  @Field()
  @IsString()
  user_guide: string;

  @Field()
  @IsBoolean()
  is_default: boolean;
}

@InputType()
export class MedicalExaminationInput {
  @Field(() => CreateTreatmentPlanInput, { nullable: true })
  treatmentPlan?: CreateTreatmentPlanInput;

  @Field(() => CreateRegimenInput)
  regimen: CreateRegimenInput;

  @Field(() => CreateExaminationReportInput)
  report: CreateExaminationReportInput;
}