import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAppointmentConfirmation(
    to: string,
    data: {
      patientName: string;
      appointmentDate: string;
      appointmentTime: string;
      doctorName: string;
      clinicName: string;
    }
  ) {
    console.log('Sending from:', process.env.MAIL_USER, 'to:', to, 'with data:', data);
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Xác nhận lịch hẹn khám bệnh',
        template: 'appointment',
        context: {
          patientName: data.patientName,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          doctorName: data.doctorName,
          clinicName: data.clinicName,
        },
      });
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      throw new Error(`Không thể gửi email: ${error.message}`);
    }
  }
}