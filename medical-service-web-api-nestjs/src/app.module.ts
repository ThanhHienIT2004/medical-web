import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { MedicationsModule } from './medications/medications.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { DoctorSchedulesModule } from './doctor_schedules/doctor_schedules.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TreatmentPlanModule } from './treatment-plan/treatment-plan.module';
import { ExaminationReportModule } from './examination-report/examination-report.module';
import { RegimenModule } from './regimen/regimen.module';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { AppointmentSlotsModule } from './appointment-slots/appointment-slots.module';
import { EmailService } from './api/send-email/email.service';
import { OtpModule } from './mail/otp.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    MedicationsModule,
    DoctorsModule,
    AuthModule,
    DoctorSchedulesModule,
    BlogPostsModule,
    PatientsModule,
    AppointmentsModule,
    TreatmentPlanModule,
    ExaminationReportModule,
    RegimenModule,
    UploadModule,
    AppointmentSlotsModule,
    OtpModule,
    MailModule,
  ],
  controllers: [AppController, UploadController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    UploadService,
    EmailService,
  ],
  exports: [EmailService],
})
export class AppModule {}