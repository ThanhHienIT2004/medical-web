import { Module } from '@nestjs/common';
import { DoctorSchedulesController } from './doctor_schedules.controller';
import { DoctorScheduleService } from './doctor_schedules.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DoctorSchedulesController],
  providers: [DoctorScheduleService, PrismaService],
})
export class DoctorSchedulesModule {}
