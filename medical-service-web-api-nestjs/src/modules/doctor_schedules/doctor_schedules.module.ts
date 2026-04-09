import { Module } from '@nestjs/common';
import { DoctorSchedulesController } from './doctor_schedules.controller';
import { DoctorScheduleService } from './doctor_schedules.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DoctorSchedulesController],
  providers: [DoctorScheduleService, PrismaService],
})
export class DoctorSchedulesModule {}
