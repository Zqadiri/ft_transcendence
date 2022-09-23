import axios from 'axios';
import { global } from '../Data/PingPong.d';
import { canvasHeight, canvasWidth, paddleHeight } from '../Data/PingPong.contants';
import { GameData } from '../../Interfaces/GameData.interface';
import { renderTheme1 } from './RenderTheme1';
import { renderTheme2 } from './RenderTheme2';

export function		handleLeftPaddle()
{
	setTimeout(() => {
		global.setCountdownDisappear?.(true);

		if (global.winnerId === 0)
			global.socket.emit("gameIsStarted", global.roomName);
	}, 3000);

	global.canvasRef?.addEventListener("mousemove", (event: MouseEvent) => {
		let rect = global.canvasRef?.getBoundingClientRect();

		global.player1Y = event.clientY - rect!.top - paddleHeight/2;
		global.socket.emit("updatePaddlePosition", {
			roomName: global.roomName,
			playerId: global.playerId,
			paddleY: global.player1Y
		});
	});
}

export function		handleRightPaddle()
{
	setTimeout(() => {
		global.setCountdownDisappear?.(true);
	}, 3000);

	global.canvasRef?.addEventListener("mousemove", (event: MouseEvent) => {
		let rect = global.canvasRef?.getBoundingClientRect();
	
		global.player2Y = event.clientY - rect!.top - paddleHeight/2;
		global.socket.emit("updatePaddlePosition", {
			roomName: global.roomName,
			playerId: global.playerId,
			paddleY: global.player2Y
		});
	});
}

export function		renderCanvas()
{
	if (global.theme === "theme01")
		renderTheme1();
	else if (global.theme === "theme02")
		renderTheme2();
}

export function resetGame() {
	global.player1Y = canvasHeight/2 - paddleHeight/2;
	global.player1Score = 0;

	global.player1Y = canvasHeight/2 - paddleHeight/2;
	global.player2Score = 0;

	global.ballX = canvasWidth/2;
	global.ballY = canvasHeight/2;

	global.gameStarted = false;
	global.roomName = "none"
	global.playerId = 0;
	global.winnerId = 0;
	global.secondPlayerExist = false;
}

function			setReceivedSocketData(data: GameData, setGameScore: Function) {
	global.player1Y = data.p1.y;
	global.player1Score = data.p1.score;

	global.player2Y = data.p2.y;
	global.player2Score = data.p2.score;

	global.ballX = data.b.x;
	global.ballY = data.b.y;

	setGameScore({
		firstPlayer: data.p1.score,
		secondPlayer: data.p2.score
	});
}

export function		addSocketEventHandlers(setCurrentPlayersData: Function, setGameScore: Function, setGameFinished: Function) {
	global.socket.off("newCoordinates").on("newCoordinates", (data) => {
		setReceivedSocketData(data, setGameScore);
		renderCanvas();
	});

	global.socket.off("theWinner").on("theWinner", (theWinner) => {
		global.winnerId = theWinner;
		setGameFinished(true);
	});

	global.socket.off("scorePanelData").on("scorePanelData", async (currentPlayersId) => {
		try {
			let firstPlayerData = await axios.get("/users?id=" + currentPlayersId.firstPlayerId);
			let secondPlayerData = await axios.get("/users?id=" + currentPlayersId.secondPlayerId);

			setCurrentPlayersData({
				firstPlayerName: firstPlayerData.data.username,
				firstPlayerAvatar: firstPlayerData.data.avatar,
				secondPlayerName: secondPlayerData.data.username,
				secondPlayerAvatar: secondPlayerData.data.avatar,
			});
		} catch {

		}
	});
}
