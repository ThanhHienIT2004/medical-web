import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppointmentSlotsService } from './appointment-slots.service';
import { AppointmentSlot } from './model/appointment-slots.model';
import { CreateAppointmentSlotInput } from './dto/create-appointment-slot.input';
import { UpdateAppointmentSlotInput } from './dto/update-appointment-slot.input';

@Resolver(() => AppointmentSlot)
export class AppointmentSlotsResolver {
  constructor(private readonly appointmentSlotsService: AppointmentSlotsService) {}

  @Query(() => [AppointmentSlot])
  async appointmentSlots(): Promise<AppointmentSlot[]> {
    return this.appointmentSlotsService.findAll();
  }

  @Query(() => AppointmentSlot)
  async appointmentSlot(@Args('id', { type: () => Int }) id: number): Promise<AppointmentSlot> {
    return this.appointmentSlotsService.findOne(id);
  }

  @Query(() => [AppointmentSlot])
  async getAppointmentSlotByScheduleId(@Args('id', { type: () => Int }) id: number): Promise<AppointmentSlot[]> {
    return this.appointmentSlotsService.findByScheduleId(id);
  }

  @Mutation(() => AppointmentSlot)
  async createAppointmentSlot(
    @Args('createAppointmentSlotInput') createAppointmentSlotInput: CreateAppointmentSlotInput,
  ): Promise<AppointmentSlot> {
    return this.appointmentSlotsService.create(createAppointmentSlotInput);
  }

  @Mutation(() => AppointmentSlot)
  async updateAppointmentSlot(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAppointmentSlotInput') updateAppointmentSlotInput: UpdateAppointmentSlotInput,
  ): Promise<AppointmentSlot> {
    return this.appointmentSlotsService.update(id, updateAppointmentSlotInput);
  }

  @Mutation(() => AppointmentSlot)
  async removeAppointmentSlot(@Args('id', { type: () => Int }) id: number): Promise<AppointmentSlot> {
    return this.appointmentSlotsService.delete(id);
  }
} 