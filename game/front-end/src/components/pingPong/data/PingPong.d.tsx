
export const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 600,
	color: "black"
}

export  type Users = {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	score: number,
}

export type Directions = {
	top: number,
	down: number,
	left: number,
	right: number
}

export const user1: Users = {
	x: 0,
	y: canvas.height/2 - 200/2,
	width: 30,
	height: 200,
	color: "WHITE",
	score: 0,
}

export const user2: Users = {
	x: canvas.width - 30,
	y: canvas.height/2 - 200/2,
	width: user1.width,
	height: user1.height,
	color: "WHITE",
	score: 0,
}

export const ball:
{x: number, y: number, speed: number, velocityX: number, velocityY: number, radius: number, color: string} = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	speed: 12,
	velocityX: 11,
	velocityY: 11,
	radius: 20,
	color: "WHITE"
}

export const net: {x: number, y: number, width: number, height: number, color: string} = {
	x: canvas.width / 2 - 2/2,
	y: 0,
	width: 2,
	height: 10,
	color: "WHITE"
}