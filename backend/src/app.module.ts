import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GameModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { AuthService } from './auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { ChatsModule } from './chats/chats.module';
import { FriendsModule } from './friends/friends.module';
import { Friend } from './friends/entities/friend.entity';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.stategy';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { FriendsService } from './friends/friends.service';
import { UserRepository } from './users/user.repository';
import { relationRepository } from './friends/relation.repository';
import { Chat } from './chats/entities/chat.entity';
import { ChatLogs } from './chat-logs/entities/chat-log.entity';
import { Auth } from './auth/auth.entity';
import { User } from './users/entities/user.entity';

require('dotenv').config();

@Module({
	imports: 
		[
			PassportModule.register({ defaultStrategy: 'jwt' }),
			ConfigModule.forRoot({
				envFilePath: '.env',
				isGlobal: true
			}),
			TypeOrmModule.forFeature([User, Friend, UserRepository, relationRepository]),
			TypeOrmModule.forRoot({
				type: 'postgres',
				 url: process.env.DATABASE_URL,
				// host: process.env.POSTGRES_HOST,
				// port: parseInt(process.env.POSTGRES_PORT),
				// username: process.env.POSTGRES_USER,
				// password: process.env.POSTGRES_PASSWORD,
				// database: process.env.POSTGRES_DATABASE,
				autoLoadEntities: true,
				entities: [
					User, Friend, Chat, ChatLogs, Auth
				],
				synchronize: true,
			}),
			JwtModule,
			UsersModule,
			GameModule,
			AuthModule,
			ChatsModule,
			FriendsModule,
			TwoFactorAuthenticationModule,
			ChatLogsModule
		],
		controllers: [AuthController, UsersController, AppController],
		providers: [UsersService, FriendsService , JwtStrategy, AuthService,  AppService],
		exports: [
			AuthService, PassportModule 
		  ],
	  })

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
