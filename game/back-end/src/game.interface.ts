type Position = {
	x: number,
	y: number,
	score: number
}

type Ball = {
	x: number,
	y: number,
	speed: number,
	velocityX: number,
	velocityY: number,
	radius: number
}

export interface GameData {
	player1: Position,
	player2: Position,
	ball: Ball
}