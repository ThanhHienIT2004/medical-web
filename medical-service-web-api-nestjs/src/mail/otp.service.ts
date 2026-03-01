// otp.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private otps = new Map<string, { code: string; expiresAt: number }>();

  generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
  }

  saveOtp(email: string, code: string) {
    this.otps.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 phút
  }

  verifyOtp(email: string, code: string): boolean {
    const entry = this.otps.get(email);
    if (!entry) return false;
    const isValid = entry.code === code && Date.now() < entry.expiresAt;
    return isValid;
  }

  deleteOtp(email: string) {
    this.otps.delete(email);
  }
}
