import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Medication, Prisma } from '@prisma/client';
import {
  CreateMedicationInput, PaginatedMedications,
  UpdateMedicationInput,
} from './types/medication.type';
import { undefined } from 'zod';

@Injectable()
export class MedicationsService {
  private readonly logger = new Logger(MedicationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchMedications(keyword: string) {
    try {
      const medications = await this.prisma.medication.findMany({
        where: {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
          acronym: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      });
      if (!medications.length) {
        throw new NotFoundException('Không tìm thấy thuốc nào.');
      }
      return medications;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Lỗi khi tìm kiếm thuốc với từ khóa ${keyword}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async getMedications(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedMedications> {
    try {
      const skip = (page - 1) * pageSize;
      const [medications, total] = await Promise.all([
        this.prisma.medication.findMany({
          skip,
          take: pageSize,
          orderBy: {
            created_at: 'asc',
          },
        }),
        this.prisma.medication.count(),
      ]);
      return {
        items: medications,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Lỗi khi lấy danh sách thuốc: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async getMedicationById(id: number): Promise<Medication> {
    try {
      const medication = await this.prisma.medication.findUnique({
        where: { id: id },
      });
      if (!medication) {
        throw new NotFoundException('Không tìm thấy thuốc này.');
      }
      return medication;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Lỗi khi lấy thuốc với ID ${id}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async createMedication(input: CreateMedicationInput) {
    try {
      return await this.prisma.medication.create({
        data: input,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException(
          'Thuốc đã tồn tại. Vui lòng nhập tên thuốc khác.',
        );
      }
      this.logger.error('Lỗi khi tạo thuốc mới:');
      throw error;
    }
  }

  async updateMedication(id: number, input: UpdateMedicationInput) {
    try {
      // filter null/undefined
      const data = Object.entries(input).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
      data.updated_at = new Date();

      return await this.prisma.medication.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Không tìm thấy thuốc này');
        }
        throw new ConflictException(
          'Thuốc đã tồn tại. Vui lòng nhập tên thuốc khác.',
        );
      }

      this.logger.error('Lỗi khi cập nhật thuốc:');
      throw error;
    }
  }

  async removeMedication(id: number) {
    try {
      const deleted = await this.prisma.medication.delete({
        where: { id },
      });

      // Kiểm tra số bản ghi còn lại
      const count = await this.prisma.medication.count();

      if (count === 0) {
        // Nếu bảng rỗng, reset sequence
        await this.prisma.$executeRaw`
          SELECT setval(pg_get_serial_sequence('"Medication"', 'id'), 1, false);
        `;
      } else {
        // Đặt sequence về max(id) + 1
        await this.prisma.$executeRaw`
          SELECT setval(pg_get_serial_sequence('"Medication"', 'id'),
                        (SELECT MAX(id) FROM "Medication") + 1, false);
        `;
      }

      return deleted;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Không tìm thấy thuốc này');
        }
      }
    }
  }
}
