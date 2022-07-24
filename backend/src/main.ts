import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
  NestFactory exposes a few static methods that allow creating an application instance.
  
*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
