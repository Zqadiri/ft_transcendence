import { io, Socket } from "socket.io-client";
import { canvasHeight, canvasWidth, paddleHeight } from '../PingPong/pingPong.contants';

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
	player1Y: number,
	player2Y: number,
	ballX: number,
	ballY: number,
	player1Score: number,
	player2Score: number,
	context: CanvasRenderingContext2D | null,
	setCountdownDisappear?: React.Dispatch<React.SetStateAction<boolean>>,
	canvasRef?: HTMLCanvasElement,
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
	player1Y: canvasHeight/2 - paddleHeight/2,
	player2Y: canvasHeight/2 - paddleHeight/2,
	ballX: canvasWidth/2,
	ballY: canvasHeight/2,
	player1Score: 0,
	player2Score: 0,
	context: null,
	gameStarted: false,
	winnerId: 0,
	roomName: "none",
	playerId: 0,
	socket: io("/game", {
		closeOnBeforeunload: false,
		autoConnect: false
	}),
	theme: "none",
	secondPlayerExist: false,
	switchContent: true
}

export interface Game {
	id: number,
	socketRoom: string,
	isPlaying:boolean,
	firstPlayerID: string,
	secondPlayerID: string,
	firstPlayerScore: number,
	secondPlayerScore: number,
	theme: string,
	createdAt: Date,
	modifiedAt: Date,
	finishedAt: Date,
}

export interface LiveGame {
	user1: string,
	user2: string,
	score1: number,
	score2: number,
	avatar1: string,
	avatar2: string,
	socketRoom: string,
	theme: string,
	id: number
}
