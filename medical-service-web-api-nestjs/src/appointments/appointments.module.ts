import { Module } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { AppointmentResolver } from './appointments.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../api/send-email/email.service';

@Module({
  providers: [AppointmentService, AppointmentResolver, PrismaService, EmailService],
})
export class AppointmentsModule {}