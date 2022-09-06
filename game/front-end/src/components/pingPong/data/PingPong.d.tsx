
export const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 600,
	color: "#205375"
}

export  type Users = {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	score: number,
}

export  type Position = {
	x: number,
	y: number,
	score: number
}

export type Directions = {
	top: number,
	down: number,
	left: number,
	right: number
}

export type GameData = {
	p1: Position,
	p2: Position,
	b: Position 
}

export const user1: Users = {
	x: 0,
	y: canvas.height/2 - 200/2,
	width: 20,
	height: 200,
	color: "#F66B0E",
	score: 0,
}

export const user2: Users = {
	x: canvas.width - 20,
	y: canvas.height/2 - 200/2,
	width: user1.width,
	height: user1.height,
	color: "#F66B0E",
	score: 0,
}

export const ball:
{x: number, y: number, radius: number, color: string} = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 15,
	color: "WHITE"
}

export const net: {x: number, y: number, width: number, height: number, color: string} = {
	x: canvas.width / 2 - 2/2,
	y: 0,
	width: 3,
	height: 10,
	color: "WHITE"
}