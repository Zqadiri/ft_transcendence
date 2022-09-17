import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { CreateGameDto, EndGameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';
import { GameRepository } from './game.repository';
import { Brackets } from 'typeorm';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private readonly GameRepo : GameRepository
	){}

	async createGame(createGameDto: CreateGameDto){
		const game = new Game();
		game.isPlaying = createGameDto.isPlaying;
		// game.isFinished = createGameDto.isFinished;
		game.firstPlayerID = createGameDto.firstPlayerID;
		game.secondPlayerID = createGameDto.secondPlayerID;
		game.theme = createGameDto.theme;
		game.modifiedAt = createGameDto.modifiedAt;
		game.socketRoom = createGameDto.socketRoom;
		const _error = validate(game);
		if ((await _error).length)
			throw new HttpException({ message: 'Game Data Validation Failed', _error }, HttpStatus.BAD_REQUEST);
		return this.GameRepo.save(game);
	}
	
	// false === FirstPlayer and true === SecondPlayer
	async updateOneScore(gameID: number, score: number, playerNum: boolean){
		const game = await this.findGameByid(gameID);
		if (!game)
			throw new HttpException({ message: 'Game Not Found' }, HttpStatus.BAD_REQUEST);
		if (playerNum === false)
			game.firstPlayerScore = score;
		else if (playerNum === true)
			game.secondPlayerScore = score;
		return this.GameRepo.update(gameID, game);
	}

	async endGame(end: EndGameDto){
        const game = await this.findGameByid(end.gameId);
	
		game.firstPlayerScore = end.firstPlayerScore;
		game.secondPlayerScore = end.secondPlayerScore;
        game.isPlaying = false;
        game.finishedAt = end.finishedAt;

        return this.GameRepo.update(end.gameId, game);
    }

	async remove(gameID: number){
		const game = await this.findGameByid(gameID);
		if (!game)
			throw new HttpException({ message: 'Game Not Found' }, HttpStatus.BAD_REQUEST);
		return this.GameRepo.remove(game);
	}

	async findGameByid(id: number) {
		const game = await this.GameRepo
		  .createQueryBuilder('game')
		  .where('game.id = :id', { id: id })
		  .getOne();
		return game;
	}

	//! Game history
	// Select all finished games where the userID is either the first or the second player 
	async findGameByUser(userID: number){
		const game = await this.GameRepo
		.createQueryBuilder('game')
		.where('game.finishedAt IS NOT NULL')
		.andWhere(
			new Brackets((qb) => {
				qb.where('game.firstPlayerID = :firstPlayerID', {firstPlayerID: userID })
				.orWhere('game.secondPlayerID = :secondPlayerID', {secondPlayerID: userID })
			}),
		)
		.getMany();
		return game;
	}
}
