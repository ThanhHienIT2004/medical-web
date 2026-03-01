// types/dashboard-reports.type.ts
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardReport{
  @Field(() => ID)
  report_id: number;

  @Field()
  report_type: string;

  @Field()
  generated_at: Date;

  @Field(() => Object)
  data: any;

  @Field()
  created_at: Date;
}

@InputType()
export class CreateDashboardReportInput {
  @Field()
  report_type: string;

  @Field()
  generated_at: Date;

  @Field(() => Object)
  data: any;
}

@InputType()
export class UpdateDashboardReportInput {
  @Field(() => ID)
  report_id: number;

  @Field({ nullable: true })
  report_type?: string;

  @Field({ nullable: true })
  generated_at?: Date;

  @Field(() => Object, { nullable: true })
  data?: any;
}

@InputType()
export class GetDashboardReportByIdInput {
  @Field(() => ID)
  report_id: number;
}

@InputType()
export class DeleteDashboardReportInput {
  @Field(() => ID)
  report_id: number;
}

@InputType()
export class GetDashboardReportByTypeInput {
  @Field()
  report_type: string;
}