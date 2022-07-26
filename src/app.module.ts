import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GameModule } from './games/games.module';
import { User } from './users/user.entity'
import { Game } from './games/game.entity'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { AuthService } from './auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { PlayersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { ChatModule } from './chats/chats.module';
import { FriendsModule } from './friends/friends.module';
import { Friend } from './friends/friend.intity';
import { Chat } from './chats/chat.entity';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.stategy';

require('dotenv').config();

@Module({
	imports: 
		[PassportModule.register({ defaultStrategy: 'jwt' }),
		ConfigModule.forRoot({
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
			entities: [User, Game, Friend, Chat],
			synchronize: true,
		}),
		JwtModule,
		UsersModule,
		GameModule,
		AuthModule,
		ChatModule,
		FriendsModule,
		TwoFactorAuthenticationModule,
		],
		controllers: [AuthController, PlayersController, AppController],
		providers: [UsersService, JwtStrategy, AuthService,  AppService],
		exports: [
			AuthService, PassportModule
		  ],
	  })

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
