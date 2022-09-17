import { Body, Controller, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { ApiOperation } from '@nestjs/swagger';
import { CreateGameDto, EndGameDto, UpdateScoreDto } from './dto/game.dto';

@Controller('game')
export class GameController {

	constructor(
		@InjectRepository(Game)
		private readonly gameRepo: GameRepository,
		private readonly gameServ: GamesService
	) { }

	@ApiOperation({ summary: 'Create a new game' })
	@Post('/new_game')
	async createNewGame(@Body() newGame: CreateGameDto) {
		return this.gameServ.createGame(newGame);
	}
	// false === FirstPlayer and true === SecondPlayer
	@ApiOperation({ summary: 'Update game info' })
	@Post('/update_game')
	async updateGame(@Body() log: UpdateScoreDto) {
		return this.gameServ.updateOneScore(log.gameId, log.PlayerScore, log.player);
	}

	@ApiOperation({ summary: 'end game' })
	@Post('/end_game')
	async endGame(@Body() log: EndGameDto) {
		return this.gameServ.endGame(log);
	}

}