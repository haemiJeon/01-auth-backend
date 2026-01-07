import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // 운영 환경(production)이면 특정 도메인만 허용, 개발 환경이면 모두 허용(true)
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://a.com', 'https://b.com']
        : true,
    credentials: true, // 쿠키/인증 헤더 전달 허용
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
