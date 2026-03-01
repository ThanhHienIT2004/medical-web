import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorWithRelations } from './type/doctors.type';
import { RegisterDoctorInput, UpdateDoctorInput } from './type/doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(dataDoctor: RegisterDoctorInput): Promise<boolean> {
    try {
      await this.prisma.doctors.create({
        data: dataDoctor,
        include: {
          user: true,
          schedules: true,
        },
      });
      return true;
    } catch (error) {
      console.error('Lỗi khi tạo doctor:', error);
      return false;
    }
  }


  async findAll(): Promise<DoctorWithRelations[]> {
    return this.prisma.doctors.findMany({
      include: {
        user: true,
        schedules: true,
      },
    });
  }

  async findOne(id: string): Promise<DoctorWithRelations> {
    const doctor = await this.prisma.doctors.findUnique({
      where: { id },
      include: {
        user: true,
        schedules: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async delete(id: string): Promise<DoctorWithRelations> {
    return this.prisma.doctors.delete({
      where: { id },
      include: {
        user: true,
        schedules: true,
      },
    });
  }

  async update(
    id: string,
    data: UpdateDoctorInput,
  ): Promise<DoctorWithRelations> {
    return this.prisma.doctors.update({
      where: { id },
      data: {
        qualifications: data.qualifications,
        work_seniority: data.work_seniority,
        gender: data.gender,
        specialty: data.specialty,
        hospital: data.hospital,
        user: {
          update: {
            full_name: data.full_name,
            email: data.email,
          },
        },
      },
      include: { user: true, schedules: true },
    });
  }
}
