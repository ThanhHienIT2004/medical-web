
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExaminationReportInput, MedicalExaminationInput } from './types/examination-report';
import { TreatmentPlan } from '@prisma/client'; // thêm dòng này nếu chưa có

@Injectable()
export class ExaminationReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateExaminationReportInput) {
    return this.prisma.examinationReport.create({ data: input });
  }

  async findAll() {
    return this.prisma.examinationReport.findMany();
  }

  async findOne(id: number) {
    const report = await this.prisma.examinationReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Examination report not found');
    return report;
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.examinationReport.delete({ where: { id } });
  }

  async make(input:MedicalExaminationInput){
    const {treatmentPlan, regimen, report } = input;

    let createPlan: TreatmentPlan | null = null;

    if(treatmentPlan){
      createPlan = await this.prisma.treatmentPlan.create({
        data: treatmentPlan,
      })
    }

    const createRegimen = await this.prisma.regimen.create({
      data: regimen,
    })

    const createReport = await this.prisma.examinationReport.create({
      data: {
        ...report,
        regimen_id: createRegimen.id,
        treatment_plan_id: createPlan?.id || null,
      },
    });

    return{
      treatmentPlan: createPlan,
      regimen: createRegimen,
      report: createReport
    }

  }
}
