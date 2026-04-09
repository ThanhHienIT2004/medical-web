import { Module } from '@nestjs/common';
import { AppointmentSlotsController } from './appointment-slots.controller';
import { AppointmentSlotsService } from './appointment-slots.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppointmentSlotsController],
  providers: [AppointmentSlotsService, PrismaService],
  exports: [AppointmentSlotsService],
})
export class AppointmentSlotsModule {}