import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameRepository } from './game.repository';
import { GameController } from './games.controller';
import { GamesService } from './games.service';
import { GameGateway } from './game.gateway';
import { UpdateGameService } from './update-game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game, GameRepository
    ]),
  ],
  controllers: [GameController],
  providers: [GamesService, GameGateway, UpdateGameService]
})
export class GameModule {}
