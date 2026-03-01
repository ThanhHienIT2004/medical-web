import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Reminder as PrismaReminder } from '@prisma/client';
import { CreateReminderInput, UpdateReminderInput } from './types/reminders.type';

@Injectable()
export class ReminderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateReminderInput): Promise<PrismaReminder> {
    return this.prisma.reminder.create({
      data: { ...input },
    });
  }

  async findAll(): Promise<PrismaReminder[]> {
    return this.prisma.reminder.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<PrismaReminder> {
    const reminder = await this.prisma.reminder.findUnique({
      where: { reminder_id: id },
    });
    if (!reminder) {
      throw new NotFoundException(`Reminder #${id} not found`);
    }
    return reminder;
  }

  async update(id: number, input: UpdateReminderInput): Promise<PrismaReminder> {
    await this.findOne(id);
    return this.prisma.reminder.update({
      where: { reminder_id: id },
      data: { ...input },
    });
  }

  async remove(id: number): Promise<PrismaReminder> {
    await this.findOne(id);
    return this.prisma.reminder.delete({
      where: { reminder_id: id },
    });
  }
}
