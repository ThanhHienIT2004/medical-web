import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLTimestamp } from 'graphql-scalars';
import { CreateRegimenInput } from '../../regimen/types/regimen.type';
import { CreateTreatmentPlanInput } from '../../treatment-plan/types/treatmentplan.type';

@ObjectType()
export class ExaminationReport {
  @Field(() => ID)
  id: string;

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

  @Field(() => ID)
  regimen_id: string;

  @Field(() => ID, { nullable: true })
  treatment_plan_id?: string;

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

  @Field(() => ID)
  regimen_id: string;

  @Field(() => ID, { nullable: true })
  treatment_plan_id?: string;
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
