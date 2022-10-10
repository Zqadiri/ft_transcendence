import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';

/*
  NestFactory exposes a few static methods that allow creating an application instance.
*/

declare global {
	interface Array<T> {
		remove(elem: T): Array<T>;
	}
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function <T>(this: T[], elem: T): T[] {
		let index = this.findIndex((el) => el === elem);
		let count = 0;
		if (index > -1)
			count = 1;
		return this.splice(index, count);
	}
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
	);
	app.useGlobalPipes(new ValidationPipe());
	const swaggerConfig = new DocumentBuilder()
		.setTitle('pong pong API')
		.setDescription('The pong API description')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);
	app.use(cookieParser());
	const fs = require("fs"); // Or `import fs from "fs";` with ESM
	if (!fs.existsSync(".env")) {
		console.error("MISSING FILE [env]");
		throw "Error";
	}
	await app.listen(3000);
}

bootstrap();
