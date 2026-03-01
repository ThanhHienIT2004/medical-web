import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateReminderInput, Reminder, UpdateReminderInput } from './types/reminders.type';
import { ReminderService } from './reminders.service';


@Resolver(() => Reminder)
export class ReminderResolver {
  constructor(private readonly reminderService: ReminderService) {}

  @Mutation(() => Reminder)
  createReminder(@Args('data') data: CreateReminderInput) {
    return this.reminderService.create(data);
  }

  @Query(() => [Reminder])
  findAllReminders() {
    return this.reminderService.findAll();
  }

  @Query(() => Reminder)
  findReminder(@Args('reminder_id', { type: () => Int }) reminder_id: number) {
    return this.reminderService.findOne(reminder_id);
  }

  @Mutation(() => Reminder)
  updateReminder(
    @Args('reminder_id', { type: () => Int }) id: number,
    @Args('data') data: UpdateReminderInput,
  ) {
    return this.reminderService.update(id, data);
  }

  @Mutation(() => Reminder)
  removeReminder(@Args('reminder_id', { type: () => Int }) id: number) {
    return this.reminderService.remove(id);
  }
}
