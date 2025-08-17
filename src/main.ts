import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EitherExceptionFilter } from '@shared/infraestructure/filters/either-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EitherExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
