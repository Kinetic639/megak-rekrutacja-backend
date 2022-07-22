import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { COOKIE_SECRET } from './config/secrets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
  });
  app.use(cookieParser(COOKIE_SECRET));
  await app.listen(3001);
}

bootstrap();
