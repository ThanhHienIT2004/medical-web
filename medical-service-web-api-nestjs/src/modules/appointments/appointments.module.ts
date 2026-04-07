import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../api/send-email/email.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentService, PrismaService, EmailService],
})
export class AppointmentsModule {}