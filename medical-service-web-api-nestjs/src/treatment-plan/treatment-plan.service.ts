import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatmentPlanInput, UpdateTreatmentPlanInput } from './types/treatmentplan.type';

@Injectable()
export class TreatmentPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTreatmentPlanInput) {
    return this.prisma.treatmentPlan.create({ data: input });
  }

  async findAll() {
    return this.prisma.treatmentPlan.findMany({
      include: {
        examinations: true,
        follow_up_appointments: true,
      },
    });
  }

  async findOne(id: number) {
    const plan = await this.prisma.treatmentPlan.findUnique({
      where: { id },
      include: {
        examinations: true,
        follow_up_appointments: true,
      },
    });
    if (!plan) throw new NotFoundException('Treatment plan not found');
    return plan;
  }

  async update(input: UpdateTreatmentPlanInput) {
    await this.findOne(input.id);
    return this.prisma.treatmentPlan.update({
      where: { id: input.id },
      data: { ...input },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.treatmentPlan.delete({ where: { id } });
  }

  async getPatientPlan(patient_id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { patient_id: patient_id },
      include: {
        plan: true,
      },
    });

    if (!patient) return null;

    return {
      patient_id: patient.patient_id,
      plan_id: patient.plan_id,
      plan: patient.plan,
    };
  }
}