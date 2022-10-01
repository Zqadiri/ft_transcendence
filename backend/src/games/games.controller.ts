import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateGameDto, EndGameDto, UpdateScoreDto } from './dto/game.dto';
import { UsersService } from 'src/users/users.service';

@Controller('game')
export class GameController {

	constructor(
		@InjectRepository(Game)
		private readonly gameRepo: GameRepository,
		private readonly gameServ: GamesService,
		private readonly userServ: UsersService
	) { }

	// @ApiOperation({ summary: 'Create a new game' })
	// @Post('/new_game')
	// async createNewGame(@Body() newGame: CreateGameDto) {
	// 	return this.gameServ.createGame(newGame);
	// }
	// // false === FirstPlayer and true === SecondPlayer
	// @ApiOperation({ summary: 'Update game info' })
	// @Post('/update_game')
	// async updateGame(@Body() log: UpdateScoreDto) {
	// 	return this.gameServ.updateOneScore(log.gameId, log.PlayerScore, log.player);
	// }

	// @ApiOperation({ summary: 'end game' })
	// @Post('/end_game')
	// async endGame(@Body() log: EndGameDto) {
	// 	await	this.gameServ.endGame(log);
	// 	const	game: Game = await this.gameServ.findGameByid(log.gameId);
	// 	let		flawLessWinStreakAchieved: boolean;
	
	// 	flawLessWinStreakAchieved = await this.gameServ.checkUserGamesForStreak(Number(game.firstPlayerID));
	// 	await this.userServ.calculateRank(Number(game.firstPlayerID), game.firstPlayerScore, game.secondPlayerScore, flawLessWinStreakAchieved);

	// 	flawLessWinStreakAchieved = await this.gameServ.checkUserGamesForStreak(Number(game.secondPlayerID));
	// 	await this.userServ.calculateRank(Number(game.secondPlayerID), game.secondPlayerScore, game.firstPlayerScore, flawLessWinStreakAchieved);

	// 	return this.gameServ.endGame(log);
	// // }

	@ApiOperation({ summary: 'Live games' })
    @Get('/live')
    async getLiveGames() {
        const games = await this.gameRepo.find({
            where: {
                isPlaying: true
            }
        });
        if (!games.length)
			return null;

        return games;
    }
}
