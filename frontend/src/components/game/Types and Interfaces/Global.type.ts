import { Socket } from "socket.io-client";

export type Global = {
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