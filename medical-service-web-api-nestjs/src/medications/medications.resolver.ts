import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicationsService } from './medications.service';
import {
  CreateMedicationInput,
  GetMedicationByIdInput,
  Medication, PaginatedMedications, SearchMedicationsInput, UpdateMedicationInput,
} from './types/medication.type';
import { NotFoundException } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';
import { PaginationInput } from '../user/types/user.type';

@Resolver()
export class MedicationsResolver {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Query(() => [Medication], { name: 'searchMedications'})
  async searchMedications(@Args('input') input: SearchMedicationsInput) {
    try {
			const keyword = input?.keyword || "";
			if (!keyword) return this.medicationsService.getMedications();

			return this.medicationsService.searchMedications(input.keyword);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new GraphQLError(errorMessage, {
          extensions: {
            code: error instanceof NotFoundException ? 'Không tìm thấy' : 'INTERNAL_SERVER_ERROR',
            originalError: error,
          },
        })
		}
  }

  @Query(() => PaginatedMedications, {name: 'medications'})
  async getMedications(
    @Args('input', { nullable: true }) input: PaginationInput = { page: 1, limit: 10 }
  ) {
    try {
      return this.medicationsService.getMedications(input.page, input.limit);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new GraphQLError(errorMessage, {
        extensions: {
          code: error instanceof NotFoundException ? 'Không tìm thấy' : 'INTERNAL_SERVER_ERROR',
          originalError: error,
        },
      })
    }
  }

  @Query(() => Medication, {name: 'medication'})
  async getMedicationById(@Args('input') input: GetMedicationByIdInput): Promise<Medication> {
    try {
      return await this.medicationsService.getMedicationById(input.id);
    }catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new GraphQLError(errorMessage, {
        extensions: {
          code: error instanceof NotFoundException ? 'Không tìm thấy' : 'INTERNAL_SERVER_ERROR',
          originalError: error,
        },
      })
    }
  }
  
  @Mutation(() => Medication, {name: 'createMedication'})
  async createMedication(@Args('input') input: CreateMedicationInput){
    try {
      return await this.medicationsService.createMedication(input);
    } catch (error) {
      throw new GraphQLError(error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }

  @Mutation(() => Medication, {name: 'updateMedication'})
  async updateMedication(
    @Args('id', {type: () => Int}) id: number,
    @Args('input') input: UpdateMedicationInput
  ){
    try {
      return await this.medicationsService.updateMedication(id, input);
    } catch (error) {
      throw new GraphQLError(error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }

  @Mutation(() => Medication)
  async deleteMedication(@Args('id', { type: () => Int }) id: number) {
    try {
      return await this.medicationsService.removeMedication(id);
    } catch (error) {
      throw new GraphQLError(error instanceof Error ? error.message : 'Unknown error occurred', {});
    }
  }
}
