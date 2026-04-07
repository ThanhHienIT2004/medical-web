import { OtpService } from './otp.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [OtpService],
  exports: [OtpService], // ✅ PHẢI CÓ nếu dùng bên ngoài
})
export class OtpModule {}
