import { Module } from '@nestjs/common';
import { DoctorScheduleResolver } from './doctor_schedules.resolver';
import { DoctorScheduleService } from './doctor_schedules.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DoctorScheduleResolver, DoctorScheduleService, PrismaService]
})
export class DoctorSchedulesModule {}
