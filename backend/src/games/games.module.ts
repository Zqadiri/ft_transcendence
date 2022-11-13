import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameRepository } from './game.repository';
import { GameController } from './games.controller';
import { GamesService } from './games.service';
import { GameGateway } from './game.gateway';
import { UpdateGameService } from './update-game.service';
import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatsService } from 'src/chats/chats.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
	  GameRepository,
	  UserRepository,
	  User,
    ]),
	ChatsModule
  ],
  controllers: [GameController],
  providers: [UsersService, GamesService, GameGateway, UpdateGameService]
})
export class GameModule {}
