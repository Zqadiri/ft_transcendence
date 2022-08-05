import { Module } from '@nestjs/common';
import { GameController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  controllers: [GameController],
  providers: [GamesService]
})
export class GameModule {}
