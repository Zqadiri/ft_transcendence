import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { GameModule } from './games/games.module';
import {Player} from './players/player.entity'
import {Game} from './games/game.entity'

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
  }), PlayersModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
