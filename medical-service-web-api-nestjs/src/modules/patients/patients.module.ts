import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientService } from './patients.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PatientsController],
  providers: [PatientService, PrismaService],
  exports: [PatientService],
})
export class PatientsModule {}
