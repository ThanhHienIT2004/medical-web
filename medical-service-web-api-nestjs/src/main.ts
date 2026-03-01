import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes configuration
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Serve static assets from the 'uploads' folder at project root
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Medical Service API')
    .setDescription('RESTful API cho hệ thống quản lý y tế')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Xác thực và phân quyền')
    .addTag('Users', 'Quản lý người dùng')
    .addTag('Doctors', 'Quản lý bác sĩ')
    .addTag('Doctor Schedules', 'Quản lý lịch bác sĩ')
    .addTag('Appointment Slots', 'Quản lý khung giờ hẹn')
    .addTag('Appointments', 'Quản lý lịch hẹn')
    .addTag('Patients', 'Quản lý bệnh nhân')
    .addTag('Medications', 'Quản lý thuốc')
    .addTag('Examination Reports', 'Quản lý báo cáo khám bệnh')
    .addTag('Treatment Plans', 'Quản lý phác đồ điều trị')
    .addTag('Regimens', 'Quản lý phác đồ thuốc')
    .addTag('Blog Posts', 'Quản lý bài viết')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();