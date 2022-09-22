import { io } from "socket.io-client";
import { canvasHeight, canvasWidth, paddleHeight } from './PingPong.contants';
import { Global } from "../../Interfaces/Global.interface";

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