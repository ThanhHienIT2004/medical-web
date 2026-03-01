import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User as PrismaUser } from '@prisma/client';
import {  PaginationInput, UpdateUserInput, UserPaginationResponse } from './types/user.type';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../mail/otp.service'; // <- đây là types thực tế trong DB
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    ) {}

  async findByEmail(email: string): Promise<PrismaUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<PrismaUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },

    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers(pagination: PaginationInput): Promise<UserPaginationResponse> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      currentPage: page,
      itemsPerPage: limit,
    };
  }
  async update(id: string, input: UpdateUserInput): Promise<PrismaUser> {
    await this.findById(id); // kiểm tra tồn tại
    return this.prisma.user.update({
      where: { id },
      data: { ...input },
    });
  }

  async delete(id: string): Promise<PrismaUser> {
    await this.findById(id); // kiểm tra tồn tại
    return this.prisma.user.delete({ where: { id } });
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return true; // Tránh lộ email tồn tại

    const otp = this.otpService.generate(); // ví dụ: random 6 số
    this.otpService.saveOtp(email, otp); // lưu DB hoặc cache

    await this.mailService.sendOtpEmail(user.email, user.full_name, otp); // gửi email

    return true;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
    const isValid = this.otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new BadRequestException('Mã xác nhận không đúng hoặc đã hết hạn');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    this.otpService.deleteOtp(email); // xoá sau khi dùng

    return true;
  }


}