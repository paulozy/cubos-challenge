import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EitherExceptionFilter } from '@shared/infraestructure/filters/either-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EitherExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
