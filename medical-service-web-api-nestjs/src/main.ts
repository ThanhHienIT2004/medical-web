import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Typecast to NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global pipes configuration
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Serve static assets from the 'uploads' folder at project root
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalFilters(new GraphQLExceptionFilter());

  app.enableCors({
    origin: "http://localhost:3001",
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();