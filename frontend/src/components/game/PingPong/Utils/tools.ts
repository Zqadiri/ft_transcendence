import axios from 'axios';
import { canvas, global } from '../Data/PingPong.d';
import { GameData } from '../../Interfaces/GameData.interface';
import { renderTheme1 } from './RenderTheme1';
import { renderTheme2 } from './RenderTheme2';
import { backendCanvasWidth } from '../Data/PingPong.contants';

export function		handleLeftPaddle()
{
	setTimeout(() => {
		global.setCountdownDisappear?.(true);

		if (global.winnerId === 0)
			global.socket.emit("gameIsStarted", global.roomName);
	}, 3000);

	global.canvasRef?.addEventListener("mousemove", (event: MouseEvent) => {
		const	rect = global.canvasRef?.getBoundingClientRect();
		const	backfrontOffset = backendCanvasWidth / canvas.width;

		global.player1Y = event.clientY - rect!.top - canvas.paddleHeight/2;
		global.socket.emit("updatePaddlePosition", {
			roomName: global.roomName,
			playerId: global.playerId,
			paddleY: global.player1Y * backfrontOffset
		});
	});
}

export function		handleRightPaddle()
{
	setTimeout(() => {
		global.setCountdownDisappear?.(true);
	}, 3000);

	global.canvasRef?.addEventListener("mousemove", (event: MouseEvent) => {
		const	rect = global.canvasRef?.getBoundingClientRect();
		const	backfrontOffset = backendCanvasWidth / canvas.width;
	
		global.player2Y = event.clientY - rect!.top - canvas.paddleHeight/2;
		global.socket.emit("updatePaddlePosition", {
			roomName: global.roomName,
			playerId: global.playerId,
			paddleY: global.player2Y * backfrontOffset
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
	global.player1Y = canvas.height/2 - canvas.paddleHeight/2;
	global.player1Score = 0;

	global.player1Y = canvas.height/2 - canvas.paddleHeight/2;
	global.player2Score = 0;

	global.ballX = canvas.width/2;
	global.ballY = canvas.height/2;

	global.gameStarted = false;
	global.roomName = "none"
	global.playerId = 0;
	global.winnerId = 0;
	global.secondPlayerExist = false;
}

function			setReceivedSocketData(data: GameData, setGameScore: Function) {
	const		backfrontOffset = canvas.width / backendCanvasWidth;

	global.player1Y = data.p1.y * backfrontOffset;
	global.player1Score = data.p1.score;

	global.player2Y = data.p2.y * backfrontOffset;
	global.player2Score = data.p2.score;

	global.ballX = data.b.x * backfrontOffset;
	global.ballY = data.b.y * backfrontOffset;

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
