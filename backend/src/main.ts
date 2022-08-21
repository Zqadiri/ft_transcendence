import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const fs = require('fs');
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
	fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
	SwaggerModule.setup('api', app, document);

	// app.useStaticAssets(join(__dirname, '../..', 'frontend/build'));
	// app.setBaseViewsDir(join(__dirname, '../..', 'frontend/build'));
	// app.set('view engine', 'html');
	// app.enableCors({ origin: "http://localhost:3000", credentials: true });
	await app.listen(3000);
}

bootstrap();

