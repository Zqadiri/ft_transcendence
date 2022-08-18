import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameRepository } from './game.repository';
import { GameController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game, GameRepository
    ]),
  ],
  controllers: [GameController],
  providers: [GamesService]
})
export class GameModule {}
