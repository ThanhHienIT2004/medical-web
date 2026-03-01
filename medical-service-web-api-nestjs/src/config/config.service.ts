// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { z } from 'zod';
//
// // Định nghĩa schema cho biến môi trường sử dụng Zod
// const envSchema = z.object({
//   // Biến môi trường cho môi trường
//   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
//   PORT: z.number().default(3000),
//
//   // Database
//   DATABASE_URL: z.string().url(),
//
//   // JWT
//   JWT_SECRET: z.string().min(1),
//   JWT_EXPIRES_IN: z.string().default('7d'),
//
//   // Cors
//   CORS_ORIGIN: z.string().default('*'),
//
//   // Redis nếu cần
//   REDIS_HOST: z.string().optional(),
//   REDIS_PORT: z.number().optional(),
//
//   // Email config nếu cần
//   SMTP_HOST: z.string().optional(),
//   SMTP_PORT: z.number().optional(),
//   SMTP_USER: z.string().optional(),
//   SMTP_PASS: z.string().optional(),
// });
//
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // Cho phép sử dụng trong toàn bộ ứng dụng
//       cache: true, // Bật cache để tối ưu hiệu suất
//       validate: (config) => {
//         try {
//           return envSchema.parse(config);
//         } catch (error) {
//           throw new Error(`Config validation error: ${error.message}`);
//         }
//       },
//       validationOptions: {
//         allowUnknown: false, // Không cho phép các biến môi trường không được định nghĩa
//         abortEarly: true, // Dừng ngay khi gặp lỗi đầu tiên
//       },
//       expandVariables: true, // Cho phép sử dụng biến môi trường lồng nhau
//       envFilePath: [
//         `.env.${process.env.NODE_ENV}.local`,
//         `.env.${process.env.NODE_ENV}`,
//         '.env.local',
//         '.env'
//       ], // Thứ tự load file env
//     }),
//   ],
// })
// export class AppConfigModule {}