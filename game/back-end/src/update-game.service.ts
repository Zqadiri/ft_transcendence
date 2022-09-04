import { Injectable } from '@nestjs/common';
import { GameCoor, GameData, Directions, Position, Ball } from "./game.interface"

/*
	1. to create a new instance of GameCoor for each game
	2. to delete an instance when the game is over
	3. send x & y of the players' paddle
	4. then update ball x & y velocity
	5. send back x & y of the ball and of the players' paddle
	6. check for score update
	7. and check if there's a winner and then the game must end
*/

@Injectable()
export class UpdateGameService {
	private gameCoordinates = new Map<string, GameCoor>();
	private global = {
		canvasWidth: 1000,
		canvasHeight: 600,
		paddleWidth: 20,
		paddleHeight: 200
	};

	create(room: string): void
	{
		let tmp: GameCoor;
		tmp.player1.x = 0;
		tmp.player1.y = this.global.canvasHeight/2 - this.global.paddleHeight/2;
		tmp.player1.score = 0;
	
		tmp.player2.x = this.global.canvasWidth - this.global.paddleWidth;
		tmp.player2.y = this.global.canvasHeight/2 - this.global.paddleHeight/2;
		tmp.player2.score = 0;

		tmp.ball.x = this.global.canvasWidth / 2;
		tmp.ball.y = this.global.canvasHeight / 2;
		tmp.ball.speed = 12;
		tmp.ball.velocityX = 11;
		tmp.ball.velocityY = 11;
		tmp.ball.radius = 15;

		this.gameCoordinates.set(room, tmp);
	}

	delete(room: string): void { this.gameCoordinates.delete(room) }

	#update_score(tmp: GameCoor): GameCoor
	{
		if (tmp.ball.x - tmp.ball.radius < 0) {
			tmp.player1.score += 1;
		}
		else if (tmp.ball.x + tmp.ball.radius > this.global.canvasWidth) {
			tmp.player2.score += 1;
		}

		if (tmp.ball.x - tmp.ball.radius < 0 || tmp.ball.x + tmp.ball.radius > this.global.canvasWidth) {
			tmp.ball.x = this.global.canvasWidth / 2;
			tmp.ball.y = this.global.canvasHeight / 2;
			tmp.ball.speed = 12;
			tmp.ball.velocityX = tmp.ball.velocityX < 0 ? 11 : -11;
			tmp.ball.velocityY = 11;
		}
		return (tmp);
	}

	#hasCollided(player: Position, ball: Ball ): boolean
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

	update(data: GameData, room: string): GameData
	{ 
		let	tmp: GameCoor = this.gameCoordinates.get(room);
		tmp.ball.x += tmp.ball.velocityX;
		tmp.ball.y += tmp.ball.velocityY;

		if (tmp.ball.y + tmp.ball.radius > this.global.canvasHeight || tmp.ball.y - tmp.ball.radius < 0) {
			tmp.ball.velocityY = -tmp.ball.velocityY;
			this.gameCoordinates.set(room, tmp);
			return (data);
		}

		let player: Position = tmp.ball.x < this.global.canvasWidth / 2 ? data.p1 : data.p2;

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
			data.b.x = tmp.ball.x;
			data.b.y = tmp.ball.y;
			return (data);
		}
		else {
			tmp = this.#update_score(tmp);
			this.gameCoordinates.set(room, tmp);
			data.b.x = tmp.ball.x;
			data.b.y = tmp.ball.y;
			data.p1.score = tmp.player1.score;
			data.p2.score = tmp.player2.score;
			return (data);
		}
	}

	check_for_the_winner(score1: number, score2: number): string
	{
		if (score1 == 5)
			return ("player1");
		else if (score2 == 5)
			return ("player2");
		return ("none");
	}
}
