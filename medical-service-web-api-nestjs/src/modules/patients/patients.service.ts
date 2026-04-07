import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientInput, UpdatePatientInput } from './types/patients.type';
import { Patient as PrismaPatient } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePatientInput): Promise<PrismaPatient> {
    return this.prisma.patient.create({
      data: { ...input },
    });
  }

  async findAll(): Promise<PrismaPatient[]> {
    return this.prisma.patient.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string): Promise<PrismaPatient> {
    const patient = await this.prisma.patient.findUnique({
      where: { patient_id: id },
      include: {
        user: true,
      },
    });
    if (!patient) {
      throw new NotFoundException(`Bệnh nhân #${id} không tìm thấy`);
    }
    return patient;
  }

  async update(id: string, input: UpdatePatientInput): Promise<PrismaPatient> {
    await this.findOne(id); // Đảm bảo bệnh nhân tồn tại
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, patient_id, ...rest } = input; // Loại bỏ patient_id khỏi rest

    const data: Prisma.PatientUpdateInput = {
      ...rest,
      updated_at: new Date(),
    };

    if (user) {
      data.user = {
        update: user as Prisma.UserUpdateInput,
      };
    }

    return this.prisma.patient.update({
      where: { patient_id: id },
      include: { user: true },
      data,
    });
  }

  async remove(id: string): Promise<PrismaPatient> {
    await this.findOne(id); // Đảm bảo bệnh nhân tồn tại
    return this.prisma.patient.delete({
      where: { patient_id: id },
    });
  }
}