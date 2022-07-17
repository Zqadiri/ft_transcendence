import { Module, NestModule, MiddlewareConsumer, Get} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { GameModule } from './games/games.module';
import { Player } from './players/player.entity'
import { Game } from './games/game.entity'
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './logger.middleware';

require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'newuser',
    password: 'password',
    database: 'db',
    entities: [Player, Game],
    synchronize: true, //! Setting synchronize: true shouldn't be used in production 
  }), PlayersModule, GameModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}