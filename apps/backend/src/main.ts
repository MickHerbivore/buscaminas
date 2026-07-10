import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const q = req.url.indexOf('?');
    const path = q === -1 ? req.url : req.url.slice(0, q);
    const query = q === -1 ? '' : req.url.slice(q);
    if (path.length > 1 && path.endsWith('/')) {
      req.url = path.slice(0, -1) + query;
    }
    next();
  });
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
