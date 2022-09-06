import { Injectable } from '@nestjs/common';
import { GameCoor, GameData, Directions, Position, Ball, Paddle } from "./game.interface"

@Injectable()
export class UpdateGameService {
	private gameCoordinates = new Map<string, GameCoor>();
	private global = {
		canvasWidth: 1000,
		canvasHeight: 600,
		paddleWidth: 20,
		paddleHeight: 200
	};
	private server: any;

	initializeServerObject(server: any): void
	{
		this.server = server;
	}

	create(room: string)
	{
		const tmp: GameCoor = {
			player1: {
				x: 0,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			player2: {
				x: this.global.canvasWidth - this.global.paddleWidth,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			ball: {
				x: this.global.canvasWidth / 2,
				y: this.global.canvasHeight / 2,
				speed: 12,
				velocityX: 11,
				velocityY: 11,
				radius: 15
			}
		};

		this.gameCoordinates.set(room, tmp);
	}

	sendDataToFrontend(room: string): void
	{
		let tmp: GameCoor = this.gameCoordinates.get(room);

		tmp.interval = setInterval(() => {
			this.#updateBallPosition(room);

			const		gameCoordinates: GameData = {
				p1: {
					x: this.gameCoordinates.get(room).player1.x,
					y: this.gameCoordinates.get(room).player1.y,
					score: this.gameCoordinates.get(room).player1.score
				},
				p2: {
					x: this.gameCoordinates.get(room).player2.x,
					y: this.gameCoordinates.get(room).player2.y,
					score: this.gameCoordinates.get(room).player2.score
				},
				b: {
					x: this.gameCoordinates.get(room).ball.x,
					y: this.gameCoordinates.get(room).ball.y,
				}
			};

			this.server.to(room).emit("newCoordinates", gameCoordinates);
		}, 1000/50);
	
		this.gameCoordinates.set(room, tmp);
	}

	#updateScore(tmp: GameCoor): GameCoor
	{
		if (tmp.ball.x - tmp.ball.radius < 0) {
			tmp.player2.score += 1;
		}
		else if (tmp.ball.x + tmp.ball.radius > this.global.canvasWidth) {
			tmp.player1.score += 1;
		}

		if (tmp.ball.x - tmp.ball.radius < 0 || tmp.ball.x + tmp.ball.radius > this.global.canvasWidth) {
			tmp.ball.x = this.global.canvasWidth / 2;
			tmp.ball.y = this.global.canvasHeight / 2;
			tmp.ball.speed = 12;
			tmp.ball.velocityX = tmp.ball.velocityX < 0 ? 11 : -11;
			tmp.ball.velocityY = 11;
			// tmp.player1.x = 0;
			// tmp.player1.y = this.global.canvasHeight/2 - this.global.paddleHeight/2;
			// tmp.player2.x = this.global.canvasWidth - this.global.paddleWidth;
			// tmp.player2.y = this.global.canvasHeight/2 - this.global.paddleHeight/2;
		}
		return (tmp);
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

	#checkForTheWinner(score1: number, score2: number, room: string): void
	{
		if (score1 === 5 || score2 === 5)
		{
			if (score1 == 5)
				this.server.to(room).emit("TheWinner", 1);
			else if (score2 == 5)
				this.server.to(room).emit("TheWinner", 2);

			clearInterval(this.gameCoordinates.get(room).interval);
			this.gameCoordinates.delete(room)
		}
	}

	#updateBallPosition(room: string)
	{ 
		let	tmp: GameCoor = this.gameCoordinates.get(room);
		tmp.ball.x += tmp.ball.velocityX;
		tmp.ball.y += tmp.ball.velocityY;

		if (tmp.ball.y + tmp.ball.radius > this.global.canvasHeight || tmp.ball.y - tmp.ball.radius < 0) {
			tmp.ball.velocityY = -tmp.ball.velocityY;
			this.gameCoordinates.set(room, tmp);
		}

		let player: Paddle = tmp.ball.x < this.global.canvasWidth / 2 ? tmp.player1 : tmp.player2;

		if (this.#hasCollided(player, tmp.ball)) {
			let collidePoint: number = tmp.ball.y - (player.y + this.global.paddleHeight / 2);
			let direction: number = tmp.ball.x < this.global.canvasWidth / 2 ? 1 : -1;
			// normalize
			collidePoint /= this.global.paddleHeight / 2;
			let angle: number = collidePoint * (Math.PI / 4);

			tmp.ball.velocityX = (tmp.ball.speed * Math.cos(angle)) * direction;
			tmp.ball.velocityY = tmp.ball.speed * Math.sin(angle);

			tmp.ball.speed += 0.5;

			this.gameCoordinates.set(room, tmp);
		}
		else {
			tmp = this.#updateScore(tmp);
			this.gameCoordinates.set(room, tmp);
			this.#checkForTheWinner(tmp.player1.score, tmp.player2.score, room);
		}
	}

	updatePaddlePosition(paddlePosition: number, room: string, playerId: number)
	{
		let tmp: GameCoor = this.gameCoordinates.get(room);

		if (playerId === 1)
			tmp.player1.y = paddlePosition;
		else if (playerId === 2)
			tmp.player2.y = paddlePosition;

		this.gameCoordinates.set(room, tmp);
	}
}
