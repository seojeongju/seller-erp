import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 정적 파일 서빙 (업로드된 이미지)
  // 개발 환경: src/uploads, 프로덕션: dist/uploads
  const uploadsPath = process.env.NODE_ENV === 'production' 
    ? join(__dirname, '..', 'uploads')
    : join(__dirname, '..', '..', 'src', 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  // 글로벌 Prefix 설정
  app.setGlobalPrefix('api');

  // CORS 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // 글로벌 Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API 서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`📍 API 엔드포인트: http://0.0.0.0:${port}/api`);
}
bootstrap();
