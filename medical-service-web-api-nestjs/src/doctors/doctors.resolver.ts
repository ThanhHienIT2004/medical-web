// doctors.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { Doctor as DoctorsGraphQL } from './type/doctors.model';
import { CreateDoctorDto, RegisterDoctorInput, UpdateDoctorInput } from './type/doctors.dto';
import { DoctorWithRelations } from './type/doctors.type';
import { AuthService } from '../auth/auth.service';
import { boolean } from 'zod';

@Resolver(() => DoctorsGraphQL)
export class DoctorsResolver {
  constructor(
    private doctorsService: DoctorsService,
    private authService: AuthService,
) {}

  @Query(() => [DoctorsGraphQL])
  async doctors(): Promise<DoctorWithRelations[]> {
    return this.doctorsService.findAll();
  }

  @Query(() => DoctorsGraphQL, { nullable: true })
  async doctor(@Args('id') id: string): Promise<DoctorWithRelations> {
    return this.doctorsService.findOne(id);
  }

  @Mutation(() => Boolean)
  async createDoctor(
    @Args('doctorData') doctorData: RegisterDoctorInput
  ): Promise<boolean> {
    try {
      await this.authService.register(doctorData);
      return true;
    } catch (error) {
      console.error('Lỗi khi tạo doctor:', error);
      return false;
    }
  }


  @Mutation(() => DoctorsGraphQL)
  async deleteDoctor(@Args('id') id: string): Promise<DoctorWithRelations> {
    return this.doctorsService.delete(id);
  }

  @Mutation(() => DoctorsGraphQL)
  async updateDoctor(@Args('id') id: string, @Args('doctorData') doctorData: UpdateDoctorInput): Promise<DoctorWithRelations> {
    return this.doctorsService.update(id, doctorData);
  }
}
