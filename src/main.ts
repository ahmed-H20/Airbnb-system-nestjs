import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/costum-HttpExeption.filter';
import { HttpMongoFilter } from './common/filters/costum-mongoExeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1'); // for change Base url

  app.useGlobalFilters(
    new HttpMongoFilter() /*filter for all Mongo exceptions*/,
    new HttpExceptionFilter() /*filter for all http exceptions*/,
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
