import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TreatmentPlanService } from './treatment-plan.service';
import {
  CreateTreatmentPlanInput, PatientPlanResponse,
  TreatmentPlan, UpdateTreatmentPlanInput,
} from './types/treatmentplan.type';

@Resolver(() => TreatmentPlan)
export class TreatmentPlanResolver {
  constructor(private readonly service: TreatmentPlanService) {}

  @Mutation(() => TreatmentPlan)
  createTreatmentPlan(@Args('input') input: CreateTreatmentPlanInput) {
    return this.service.create(input);
  }

  @Query(() => [TreatmentPlan])
  findAllTreatmentPlans() {
    return this.service.findAll();
  }

  @Query(() => TreatmentPlan)
  findTreatmentPlan(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => TreatmentPlan)
  updateTreatmentPlan(@Args('input') input: UpdateTreatmentPlanInput) {
    return this.service.update(input);
  }

  @Mutation(() => TreatmentPlan)
  deleteTreatmentPlan(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }

  @Query(() => PatientPlanResponse)
  findPatientPlan(@Args('patient_id', { type: () => String }) patient_id: string) {
    return this.service.getPatientPlan(patient_id);
  }
}
