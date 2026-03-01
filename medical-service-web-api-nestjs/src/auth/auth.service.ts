import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { compare, hash } from 'bcrypt';
import { LoginResponse } from './models/auth.model';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
) {}

  async register(userData: RegisterDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email: userData.email, },
    });
    if (user) {
      throw new HttpException(
        { message: 'email đã tồn tại!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPass = await hash(userData.password, 10);

    return this.prismaService.user.create({
      data: { ...userData, password: hashPass },
    });
  }

  async login(userData: LoginDto): Promise<LoginResponse> {
    //step1: check email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Không tìm thấy email này!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //step2: check password
    const verify = await compare(userData.password, user.password);

    if (!verify) {
      throw new HttpException(
        { message: 'Mật khẩu không đúng!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //step3: generate accessToken and refreshToken
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
