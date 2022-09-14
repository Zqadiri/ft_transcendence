import { NavigateFunction } from 'react-router-dom';
import { io, Socket } from "socket.io-client";

type Position = {
	x: number,
	y: number,
	score: number
}

export type GameData = {
	p1: Position,
	p2: Position,
	b: Position 
}

type Global = {
	canvasWidth: number,
	canvasHeight: number,
	player1X: number,
	player1Y: number,
	paddleWidth: number,
	paddleHeight: number,
	player2X: number,
	player2Y: number,
	ballX: number,
	ballY: number,
	player1Score: number,
	player2Score: number,
	netX: number,
	netY: number,
	netWidth: number,
	netHeight: number,
	context: CanvasRenderingContext2D | null,
	setScore1?: React.Dispatch<React.SetStateAction<number>>,
	setScore2?: React.Dispatch<React.SetStateAction<number>>,
	setDisappear?: React.Dispatch<React.SetStateAction<boolean>>,
	setForceChange?: React.Dispatch<React.SetStateAction<boolean>>,
	navigate?: NavigateFunction,
	gameStarted: boolean,
	winnerId: number;
	roomName: string,
	playerId: number,
	socket: Socket,
	theme: string,
	secondPlayerExist: boolean,
	switchContent: boolean
}

export const global: Global = {
	canvasWidth: 1000,
	canvasHeight: 600,
	player1X: 0,
	player1Y: 600/2 - 150/2,
	paddleWidth: 20,
	paddleHeight: 150,
	player2X: 1000 - 20,
	player2Y: 600/2 - 150/2,
	ballX: 1000/2,
	ballY: 600/2,
	player1Score: 0,
	player2Score: 0,
	netX: 1000/2 - 2/2,
	netY: 0,
	netWidth: 3,
	netHeight: 10,
	context: null,
	gameStarted: false,
	winnerId: 0,
	roomName: "none",
	playerId: 0,
	socket: io("http://10.11.13.7:3001/game", {
	closeOnBeforeunload: false
	}),
	theme: "none",
	secondPlayerExist: false,
	switchContent: true
}

export const theme1 = {
	canvas: {
		color: "BLACK"
	},
	player1: {
		color: "#EEEEEE"
	},
	player2: {
		color: "#EEEEEE"
	},
	ball: {
		color: "#EEEEEE",
		radius: 15
	},
	net: {
		color: "#EEEEEE"
	}
}

export const theme2 = {
	canvas: {
		firstColor: "#295c7d",
		secondColor: "#112B3C"
	},
	player1: {
		firstColor: "#F66B0E",
		secondColor: "#f5883f"
	},
	player2: {
		firstColor: "#f5883f",
		secondColor: "#F66B0E"
	},
	ball: {
		firstColor: "#f69b5e",
		secondColor: "#F66B0E",
		radius: 15
	},
	net: {
		firstColor: "#4c81a5",
		secondColor: "#295c7d"
	}
}
