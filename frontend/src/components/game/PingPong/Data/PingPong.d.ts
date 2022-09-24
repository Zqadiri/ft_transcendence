import { io } from "socket.io-client";
import { Global } from "../../Interfaces/Global.interface";

export const global: Global = {
	player1Y: 0,
	player2Y: 0,
	ballX: 0,
	ballY: 0,
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

export const canvas = {
	width: 0,
	height: 0,
	player2X: 0,
	paddleWidth: 0,
	paddleHeight: 0,
	netX: 0,
	netWidth: 0,
	netHeight: 0,
	ballRadius: 0
}