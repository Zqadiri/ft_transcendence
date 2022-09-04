import { Injectable } from '@nestjs/common';
import { GameData } from "./game.interface"

/*
	1. to create a new instance of GameData for each game
	2. to delete an instance when the game is over
	3. send x & y of the players' paddle
	4. then update ball x & y velocity
	5. send back x & y of the ball and of the players' paddle
	6. check for score update
	7. and check if there's a winner and them the game must end
*/

@Injectable()
export class UpdateGameService {
	private gameCoordinates = new Map<string, GameData>();

	create(room: string)
	{
		let tmp: GameData;
		tmp.player1.x = 0;
		tmp.player1.y = 600/2 - 200/2;
		tmp.player1.score = 0;
	
		tmp.player2.x = 1000 - 20;
		tmp.player2.y = 600/2 - 200/2;
		tmp.player2.score = 0;

		tmp.ball.x = 1000 / 2;
		tmp.ball.y = 600 / 2;
		tmp.ball.speed = 12;
		tmp.ball.velocityX = 11;
		tmp.ball.velocityY = 11;
		tmp.ball.radius = 15;

		this.gameCoordinates.set(room, tmp);
	}

	delete(room: string) { this.gameCoordinates.delete(room) }
}
