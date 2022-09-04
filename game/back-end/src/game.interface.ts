type position = {
	x: number,
	y: number
}

export interface GameData {
	player1: position,
	player2: position,
	ball: position
}