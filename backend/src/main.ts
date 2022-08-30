import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

/*
  NestFactory exposes a few static methods that allow creating an application instance.
  
*/

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('pong pong API')
    .setDescription('The pong API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
//   app.useStaticAssets(join(__dirname, '..', 'static'));
//   app.setBaseViewsDir(join(__dirname, '..', 'views'));
//   app.setViewEngine('hbs');

  await app.listen(3000);
}

bootstrap();
