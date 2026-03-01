import { Module } from '@nestjs/common';
import { PatientService } from './patients.service';
import { PatientResolver } from './patients.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PatientResolver, PatientService, PrismaService],
  exports: [PatientService],
})
export class PatientsModule {}
