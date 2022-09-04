import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { UpdateGameService } from './update-game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, UpdateGameService],
})
export class AppModule {}
