import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { GameModule } from './games/games.module';
import { User } from './players/player.entity'
import { Game } from './games/game.entity'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PlayersService } from './players/players.service';
import { PlayersController } from './players/players.controller';
import { AuthController } from './auth/auth.controller';
import { ChatModule } from './chats/chats.module';

require('dotenv').config();

@Module({
	imports: [ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true
		}),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			entities: [User, Game],
			synchronize: true,
		}),
		PlayersModule,
		GameModule,
		AuthModule,
		ChatModule
		],
		controllers: [AuthController, PlayersController, AppController],
		providers: [PlayersService, JwtService, AuthService,  AppService],
	  })

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
