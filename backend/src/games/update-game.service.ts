import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameCoor, GameData, Directions, Ball, Paddle } from "./game.interface"
import { GamesService } from './games.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UpdateGameService {
	private gameCoordinates = new Map<string, GameCoor>();
	private global = {
		canvasWidth: 1000,
		canvasHeight: 600,
		paddleWidth: 20,
		paddleHeight: 150,
		isSimulationInitiated: false
	};
	constructor (
		private readonly gameServ: GamesService,
		private readonly userServ: UsersService
	) {}
	private server: Server;

	initializeServerObject(server: Server): void
	{
		this.server = server;
	}

	async create(room: string, theme: string, player1Id: string, player2Id: string, firstUserID: number, secondUserID: number)
	{
		const tmp: GameCoor = {
			player1: {
				socketId: player1Id,
				userId: firstUserID,
				x: 0,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			player2: {
				socketId: player2Id,
				userId: secondUserID,
				x: this.global.canvasWidth - this.global.paddleWidth,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			ball: {
				x: this.global.canvasWidth / 2,
				y: this.global.canvasHeight / 2,
				speed: 10,
				velocityX: 10,
				velocityY: 10,
				radius: 15
			},
			theme: theme,
			pause: true,
			gameID: 0
		};

		if (tmp.theme === "theme02")
		{
			tmp.ball.speed = 14;
			tmp.ball.velocityX = 14;
			tmp.ball.velocityY = 14;
		}

		this.gameCoordinates.set(room, tmp);
	
		const response = await this.gameServ.createGame({
			firstPlayerID: String(firstUserID),
			secondPlayerID: String(secondUserID),
			theme: theme,
			socketRoom: room,
			createdAt: new Date(),
		});
		tmp.gameID = response.id;
		this.gameCoordinates.set(room, tmp);

		this.server.local.emit("newGameIsAvailable");
	}

	async #updateUsersAchievements(gameId)
	{
		const	game = await this.gameServ.findGameByid(gameId);
		let		flawLessWinStreakAchieved: boolean;
	
		flawLessWinStreakAchieved = await this.gameServ.checkUserGamesForStreak(Number(game.firstPlayerID));
		await this.userServ.calculateRank(Number(game.firstPlayerID), game.firstPlayerScore, game.secondPlayerScore, flawLessWinStreakAchieved);

		flawLessWinStreakAchieved = await this.gameServ.checkUserGamesForStreak(Number(game.secondPlayerID));
		await this.userServ.calculateRank(Number(game.secondPlayerID), game.secondPlayerScore, game.firstPlayerScore, flawLessWinStreakAchieved);
	}

	async #checkForTheWinner(score1: number, score2: number, room: string, id: number)
	{
		if (score1 === 10 || score2 === 10)
		{
			if (score1 == 10)
				this.server.to(room).emit("theWinner", 1);
			else if (score2 == 10)
				this.server.to(room).emit("theWinner", 2);

			this.server.local.emit("gameEnded");
			this.gameCoordinates.delete(room);

			await this.gameServ.endGame({
				firstPlayerScore: score1,
				secondPlayerScore: score2,
				gameId: id,
				finishedAt: new Date()
			});
			this.#updateUsersAchievements(id);
		}
	}

	#setGameCoordinates(game: GameCoor): GameData
	{
		return ({
			p1: {
				userId: game.player1.userId,
				y: game.player1.y,
				score: game.player1.score
			},
			p2: {
				userId: game.player2.userId,
				y: game.player2.y,
				score: game.player2.score
			},
			b: {
				x: game.ball.x,
				y: game.ball.y,
			}
		});
	}

	#sendDataToFrontend()
	{
		this.global.isSimulationInitiated = true;
		let		gameCoordinates: GameData;

		const intervalRet = setInterval(() => {
			if (this.gameCoordinates.size === 0)
			{
				clearInterval(intervalRet);
				this.global.isSimulationInitiated = false;
			}
			for (const [room, game] of this.gameCoordinates)
			{
				if (game.pause === false)
				{
					this.#updateBallPosition(game);
					this.#checkForTheWinner(game.player1.score, game.player2.score, room, game.gameID);
				}
				gameCoordinates = this.#setGameCoordinates(game);
				this.server.to(room).emit("newCoordinates", gameCoordinates, room);
			}
		}, 1000/60);
	}

	activateGame(room: string)
	{
		this.gameCoordinates.get(room).pause = false;
		if (this.global.isSimulationInitiated === false)
			this.#sendDataToFrontend();
	}

	initializeScorePanel(room: string): void
	{
		if (this.gameCoordinates.get(room))
		{
			this.server.to(room).emit("scorePanelData", {
				firstPlayerId: this.gameCoordinates.get(room).player1.userId,
				secondPlayerId: this.gameCoordinates.get(room).player2.userId,
			});
		}
	}

	 // false === FirstPlayer and true === SecondPlayer
	#updateScore(game: GameCoor)
	{
		if (game.ball.x + game.ball.radius < 0) {
			game.player2.score += 1;

			this.gameServ.updateOneScore(
				game.gameID,
				game.player2.score,
				true
			);
		}
		else if (game.ball.x - game.ball.radius > this.global.canvasWidth) {
			game.player1.score += 1;

			this.gameServ.updateOneScore(
				game.gameID,
				game.player1.score,
				false
			);
		}

		if (game.ball.x + game.ball.radius < 0 || game.ball.x - game.ball.radius > this.global.canvasWidth) {
			game.ball.x = this.global.canvasWidth / 2;
			game.ball.y = this.global.canvasHeight / 2;
			if (game.theme === "theme01")
			{
				game.ball.speed = 10;
				game.ball.velocityX = game.ball.velocityX < 0 ? 10 : -10;
				game.ball.velocityY = 10;
			}
			else if (game.theme === "theme02")
			{
				game.ball.speed = 14;
				game.ball.velocityX = game.ball.velocityX < 0 ? 14 : -14;
				game.ball.velocityY = 14;
			}
			game.pause = true;
			setTimeout(() => {
				game.pause = false;
			}, 400);
		}
	}

	#hasCollided(player: Paddle, ball: Ball ): boolean
	{
		const b: Directions = {
			top: ball.y - ball.radius,
			down: ball.y + ball.radius,
			left: ball.x - ball.radius,
			right: ball.x + ball.radius
		}
		const p: Directions = {
			top: player.y,
			down: player.y + this.global.paddleHeight,
			left: player.x,
			right: player.x + this.global.paddleWidth 
		}
		return (b.left < p.right && b.down > p.top && b.right > p.left && b.top < p.down);
	}

	#updateBallPosition(game: GameCoor): void
	{ 
		game.ball.x += game.ball.velocityX;
		game.ball.y += game.ball.velocityY;

		if (game.ball.y + game.ball.radius >= this.global.canvasHeight)
			game.ball.velocityY = -Math.abs(game.ball.velocityY);
		else if (game.ball.y - game.ball.radius < 0)
			game.ball.velocityY = Math.abs(game.ball.velocityY);

		let player: Paddle = game.ball.x < this.global.canvasWidth / 2 ? game.player1 : game.player2;

		if (this.#hasCollided(player, game.ball)) {
			let collidePoint: number = game.ball.y - (player.y + this.global.paddleHeight / 2);
			let direction: number = game.ball.x < this.global.canvasWidth / 2 ? 1 : -1;
			// normalize
			collidePoint /= this.global.paddleHeight / 2;
			let angle: number = collidePoint * (Math.PI / 4);

			game.ball.speed += 0.5;

			game.ball.velocityX = ((game.ball.speed * Math.cos(angle)) * direction) * 1.3;
			game.ball.velocityY = (game.ball.speed * Math.sin(angle)) * 1.3;
		}
		else {
			this.#updateScore(game);
		}
	}

	updatePaddlePosition(paddlePosition: number, room: string, playerId: number): void
	{
		let tmp: GameCoor = this.gameCoordinates.get(room);

		if (tmp)
		{
			if (playerId === 1)
				tmp.player1.y = paddlePosition;
			else if (playerId === 2)
				tmp.player2.y = paddlePosition;

			this.gameCoordinates.set(room, tmp);
		}
	}

	setWinnerAfterDisconnect(playerId: string): void
	{
		for (const [key, value] of this.gameCoordinates) {
			if (value.player1.socketId === playerId)
			{
				this.#checkForTheWinner(value.player1.score, 10, key, value.gameID);
				break ;
			}
			else if (value.player2.socketId === playerId)
			{
				this.#checkForTheWinner(10, value.player2.score, key, value.gameID);
				break ;
			}
		}
	}
}
