import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Patient, CreatePatientInput, UpdatePatientInput, GetPatientByIdInput, DeletePatientInput } from './types/patients.type';
import { PatientService } from './patients.service';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Mutation(() => Patient)
  createPatient(@Args('input') input: CreatePatientInput) {
    return this.patientService.create(input);
  }

  @Query(() => [Patient])
  findAllPatients() {
    return this.patientService.findAll();
  }

  @Query(() => Patient)
  findOnePatient(@Args('input') input: GetPatientByIdInput) {
    return this.patientService.findOne(input.patient_id);
  }

  @Query(() => [Patient])
  getAllPatients(@Args('input') input: GetPatientByIdInput) {}

  @Mutation(() => Patient)
  updatePatient(@Args('input') input: UpdatePatientInput) {
    return this.patientService.update(input.patient_id, input);
  }

  @Mutation(() => Boolean)
  deletePatient(@Args('input') input: DeletePatientInput) {
    return this.patientService.remove(input.patient_id);
  }
}
