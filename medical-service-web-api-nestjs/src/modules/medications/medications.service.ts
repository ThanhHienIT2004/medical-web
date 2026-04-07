import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Medication, Prisma } from '@prisma/client';
import {
  CreateMedicationInput, PaginatedMedications,
  UpdateMedicationInput,
} from './types/medication.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

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

  async getMedications(query?: PaginationQueryDto): Promise<PaginatedMedications>;
  async getMedications(page?: number, pageSize?: number): Promise<PaginatedMedications>;
  async getMedications(
    pageOrQuery: number | PaginationQueryDto = 1,
    pageSize: number = 10,
  ): Promise<PaginatedMedications> {
    try {
      const page =
        typeof pageOrQuery === 'number' ? pageOrQuery : (pageOrQuery.page ?? 1);
      const limit =
        typeof pageOrQuery === 'number' ? pageSize : (pageOrQuery.limit ?? pageSize);

      // Backward-compatible naming: service historically used `pageSize`
      const take = limit;
      const skip = (page - 1) * take;
      const [medications, total] = await Promise.all([
        this.prisma.medication.findMany({
          skip,
          take,
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
        pageSize: take,
        totalPages: Math.ceil(total / take),
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

  async getMedicationById(id: string): Promise<Medication> {
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

  async updateMedication(id: string, input: UpdateMedicationInput) {
    try {
      const data: Prisma.MedicationUpdateInput = {};
      if (input.acronym !== undefined && input.acronym !== null) data.acronym = input.acronym;
      if (input.name !== undefined && input.name !== null) data.name = input.name;
      if (input.price !== undefined && input.price !== null) data.price = input.price;
      if (input.available_quantity !== undefined && input.available_quantity !== null) {
        data.available_quantity = input.available_quantity;
      }
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

  async removeMedication(id: string) {
    try {
      const deleted = await this.prisma.medication.delete({
        where: { id },
      });

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
