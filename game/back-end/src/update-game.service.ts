import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameCoor, GameData, Directions, Ball, Paddle } from "./game.interface"

@Injectable()
export class UpdateGameService {
	private gameCoordinates = new Map<string, GameCoor>();
	private global = {
		canvasWidth: 1000,
		canvasHeight: 600,
		paddleWidth: 20,
		paddleHeight: 150
	};
	private server: Server;

	initializeServerObject(server: Server): void
	{
		this.server = server;
	}

	create(room: string, theme: string, player1Id: string, player2Id: string)
	{
		const tmp: GameCoor = {
			player1: {
				id: player1Id,
				x: 0,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			player2: {
				id: player2Id,
				x: this.global.canvasWidth - this.global.paddleWidth,
				y: this.global.canvasHeight/2 - this.global.paddleHeight/2,
				score: 0
			},
			ball: {
				x: this.global.canvasWidth / 2,
				y: this.global.canvasHeight / 2,
				speed: 12,
				velocityX: 12,
				velocityY: 12,
				radius: 15
			},
			theme: theme,
			pause: false
		};

		if (tmp.theme === "theme02")
		{
			tmp.ball.speed = 20;
			tmp.ball.velocityX = 20;
			tmp.ball.velocityY = 20;
		}

		this.gameCoordinates.set(room, tmp);
	}

	sendDataToFrontend(room: string): void
	{
		let tmp: GameCoor = this.gameCoordinates.get(room);

		tmp.interval = setInterval(() => {

			if (this.gameCoordinates.get(room).pause === false)
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
			this.#checkForTheWinner(gameCoordinates.p1.score, gameCoordinates.p2.score, room);

		}, 1000/60);
	
		this.gameCoordinates.set(room, tmp);
	}

	#updateScore(tmp: GameCoor): GameCoor
	{
		if (tmp.ball.x + tmp.ball.radius < 0) {
			tmp.player2.score += 1;
		}
		else if (tmp.ball.x - tmp.ball.radius > this.global.canvasWidth) {
			tmp.player1.score += 1;
		}

		if (tmp.ball.x + tmp.ball.radius < 0 || tmp.ball.x - tmp.ball.radius > this.global.canvasWidth) {
			tmp.ball.x = this.global.canvasWidth / 2;
			tmp.ball.y = this.global.canvasHeight / 2;
			if (tmp.theme === "theme01")
			{
				tmp.ball.speed = 12;
				tmp.ball.velocityX = tmp.ball.velocityX < 0 ? 12 : -12;
				tmp.ball.velocityY = 12;
			}
			else if (tmp.theme === "theme02")
			{
				tmp.ball.speed = 16; // 12
				tmp.ball.velocityX = tmp.ball.velocityX < 0 ? 16 : -16; // 11
				tmp.ball.velocityY = 16;
			}
			tmp.pause = true;
			setTimeout(() => {
				tmp.pause = false;
			}, 400);
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
				this.server.to(room).emit("theWinner", 1);
			else if (score2 == 5)
				this.server.to(room).emit("theWinner", 2);

			clearInterval(this.gameCoordinates.get(room).interval);
			this.gameCoordinates.delete(room)
		}
	}

	// delete (room: string): void
	// {
	// 	this.gameCoordinates.delete(room)
	// }

	#updateBallPosition(room: string): void
	{ 
		let	tmp: GameCoor = this.gameCoordinates.get(room);
		tmp.ball.x += tmp.ball.velocityX;
		tmp.ball.y += tmp.ball.velocityY;

		if (Math.abs(tmp.ball.y) + tmp.ball.radius >= this.global.canvasHeight || Math.abs(tmp.ball.y) - tmp.ball.radius <= 0) {
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

			tmp.ball.speed += 0.5;

			tmp.ball.velocityX = ((tmp.ball.speed * Math.cos(angle)) * direction) * 1.2;
			tmp.ball.velocityY = (tmp.ball.speed * Math.sin(angle)) * 1.2;


			this.gameCoordinates.set(room, tmp);
		}
		else {
			tmp = this.#updateScore(tmp);
			this.gameCoordinates.set(room, tmp);
		}
	}

	updatePaddlePosition(paddlePosition: number, room: string, playerId: number): void
	{
		let tmp: GameCoor = this.gameCoordinates.get(room);

		if (playerId === 1)
			tmp.player1.y = paddlePosition;
		else if (playerId === 2)
			tmp.player2.y = paddlePosition;

		this.gameCoordinates.set(room, tmp);
	}

	OnePlayerDisconnect(playerId: string): void
	{
		for (const [key, value] of this.gameCoordinates) {
			if (value.player1.id === playerId)
			{
				this.#checkForTheWinner(value.player1.score, 10, key);
				break ;
			}
			else if (value.player2.id === playerId)
			{
				this.#checkForTheWinner(10, value.player2.score, key);
				break ;
			}
		}
	}
}
