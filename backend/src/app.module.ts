import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GameModule } from './games/games.module';
import { User } from './users/entities/user.entity'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { ChatsModule } from './chats/chats.module';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.stategy';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { UserRepository } from './users/user.repository';
import { Chat } from './chats/entities/chat.entity';
import { ChatLogs } from './chat-logs/entities/chat-log.entity';
import { Auth } from './auth/entities/auth.entity';
import { Game } from './games/entities/game.entity';
import { GameRepository } from './games/game.repository';
import { GamesService } from './games/games.service';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';
import { GameController } from './games/games.controller';

require('dotenv').config();

@Module({
	imports: 
		[
			ServeStaticModule.forRoot({
				rootPath: join(__dirname, "../..", "frontend/build"),
			}),
			PassportModule.register({ defaultStrategy: 'jwt' }),
			ConfigModule.forRoot({
				envFilePath: '.env',
				isGlobal: true
			}),
			TypeOrmModule.forFeature([User, UserRepository,
							Game, GameRepository]),
			TypeOrmModule.forRoot({
				type: 'postgres',
				url: process.env.DATABASE_URL,
				autoLoadEntities: true,
				entities: [
					User, Chat, ChatLogs, Auth, Game
				],
				synchronize: true,
			}),
			JwtModule,
			UsersModule,
			GameModule,
			AuthModule,
			ChatsModule,
			TwoFactorAuthenticationModule,
			ChatLogsModule
		],
		controllers: [AuthController, UsersController, AppController, GameController],
		providers: [UsersService, JwtStrategy, AuthService,  AppService, GamesService],
		exports: [
			AuthService, PassportModule 
		  ],
	  })

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
