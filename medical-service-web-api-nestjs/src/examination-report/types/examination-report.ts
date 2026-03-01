import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLTimestamp } from 'graphql-scalars';
import { CreateRegimenInput } from '../../regimen/types/regimen.type';
import { CreateTreatmentPlanInput } from '../../treatment-plan/types/treatmentplan.type';

@ObjectType()
export class ExaminationReport {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => String)
  doctor_id: string;

  @Field()
  risk_assessment: string;

  @Field()
  is_HIV: boolean;

  @Field()
  HIV_test_file: string;

  @Field(() => Int)
  regimen_id: number;

  @Field(() => Int, { nullable: true })
  treatment_plan_id?: number;

  @Field(() => GraphQLTimestamp)
  created_at: Date;

  @Field(() => GraphQLTimestamp, { nullable: true })
  updated_at?: Date;
}

@InputType()
export class CreateExaminationReportInput {
  @Field()
  name: string;

  @Field(() => String)
  doctor_id: string;

  @Field()
  risk_assessment: string;

  @Field()
  is_HIV: boolean;

  @Field()
  HIV_test_file: string;

  @Field(() => Int)
  regimen_id: number;

  @Field(() => Int, { nullable: true })
  treatment_plan_id?: number;
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
