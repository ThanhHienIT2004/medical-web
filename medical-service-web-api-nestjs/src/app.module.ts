import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { MedicationsModule } from './modules/medications/medications.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { DoctorSchedulesModule } from './modules/doctor_schedules/doctor_schedules.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { TreatmentPlanModule } from './modules/treatment-plan/treatment-plan.module';
import { ExaminationReportModule } from './modules/examination-report/examination-report.module';
import { RegimenModule } from './modules/regimen/regimen.module';
import { BlogPostsModule } from './modules/blog-posts/blog-posts.module';
import { UploadModule } from './modules/upload/upload.module';
import { AppointmentSlotsModule } from './modules/appointment-slots/appointment-slots.module';
import { EmailService } from './modules/api/send-email/email.service';
import { OtpModule } from './modules/mail/otp.module';
import { MailModule } from './modules/mail/mail.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DashboardReportsModule } from './modules/dashboard-reports/dashboard-reports.module';

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
    DocumentsModule,
    DashboardReportsModule,
    OtpModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class AppModule {}