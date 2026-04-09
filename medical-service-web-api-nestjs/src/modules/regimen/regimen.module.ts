import { Module } from '@nestjs/common';
import { RegimenController } from './regimen.controller';
import { RegimenService } from './regimen.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RegimenController],
  providers: [RegimenService, PrismaService],
})
export class RegimenModule {}
