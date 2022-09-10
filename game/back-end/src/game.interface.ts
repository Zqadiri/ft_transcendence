export type Paddle = {
	x: number,
	y: number,
	score: number
}

export type Ball = {
	x: number,
	y: number,
	speed: number,
	velocityX: number,
	velocityY: number,
	radius: number
}

export type Position = {
	x: number,
	y: number
}

export interface GameCoor {
	player1: Paddle,
	player2: Paddle,
	ball: Ball,
	interval?: NodeJS.Timer,
	theme: string
}

export interface GameData {
	p1: Paddle,
	p2: Paddle,
	b: Position
}

export interface Directions {
	top: number,
	down: number,
	left: number,
	right: number
}