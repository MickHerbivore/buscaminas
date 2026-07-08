import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = app.get(ConfigService);
  const origins = config.get<string>('CORS_ORIGINS');
  app.enableCors(
    origins
      ? { origin: origins.split(',').map((o) => o.trim()) }
      : undefined,
  );

  const port = Number(config.get<number>('PORT') ?? 3000);
  await app.listen(port);
}
bootstrap();
