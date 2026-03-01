import { Module } from '@nestjs/common';
import { DoctorsResolver } from './doctors.resolver';
import { DoctorsService } from './doctors.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DoctorsResolver, DoctorsService, PrismaService]
})
export class DoctorsModule {}
