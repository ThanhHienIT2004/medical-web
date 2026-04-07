import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ReminderResolver } from './reminders.resolver';
import { ReminderService } from './reminders.service';

@Module({
  providers: [ReminderResolver, ReminderService, PrismaService],
  exports: [ReminderService]
})
export class ReminderModule {}
