import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../mail/otp.module';

@Module({
  imports: [
    MailModule, // ✅ BẮT BUỘC nếu dùng MailService
    OtpModule,
  ],
  providers: [UserResolver, UserService, PrismaService, JwtService],
  exports: [UserService]
})
export class UserModule {}
