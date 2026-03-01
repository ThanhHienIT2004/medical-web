import { Module } from '@nestjs/common';
import { AppointmentSlotsService } from './appointment-slots.service';
import { AppointmentSlotsResolver } from './appointment-slots.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AppointmentSlotsResolver, AppointmentSlotsService, PrismaService],
  exports: [AppointmentSlotsService],
})
export class AppointmentSlotsModule {} 