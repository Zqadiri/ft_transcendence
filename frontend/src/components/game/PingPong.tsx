import { createContext, useEffect, useState } from 'react';
import "../../styles/game-styling.scss";
import Canvas from './Canvas';
import Score from './Score';
import ResultPrompt, { resetGame } from './ResultPrompt';
import CountDown from './CountDown';
import { global, GameData, CurrentPlayersType } from './data/PingPong.d';
import { renderTheme1 } from "./RenderTheme1";
import { renderTheme2 } from "./RenderTheme2";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import axios from 'axios';

export let gameContext = createContext<any>({});

const render = (): void => {
	if (global.theme === "theme01")
		renderTheme1();
	else if (global.theme === "theme02")
		renderTheme2();
}

function setReceivedSocketData(data: GameData, setGameScore: Function) {
	global.player1X = data.p1.x;
	global.player1Y = data.p1.y;
	global.player1Score = data.p1.score;

	global.player2X = data.p2.x;
	global.player2Y = data.p2.y;
	global.player2Score = data.p2.score;

	global.ballX = data.b.x;
	global.ballY = data.b.y;

	setGameScore({
		firstPlayerScore: data.p1.score,
		secondPlayerScore: data.p2.score
	});
}


const game = (current: HTMLCanvasElement | null) => {
	if (current !== null) {
		global.context = current.getContext("2d");
		render();

		if (!global.gameStarted)
		{
			if (global.playerId === 1)
			{
				setTimeout(() => {
				global.setCountdownDisappear?.(true);
				if (global.winnerId === 0)
					global.socket.emit("gameIsStarted", global.roomName);
				}, 3000);
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					global.player1Y = event.clientY - rect.top - global.paddleHeight/2;
					global.socket.emit("updatePaddlePosition", {roomName: global.roomName, playerId: global.playerId, y: global.player1Y});
				});
			}
			else if (global.playerId === 2)
			{
				setTimeout(() => {
					global.setCountdownDisappear?.(true);
				}, 3000);
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					global.player2Y = event.clientY - rect.top - global.paddleHeight/2;
					global.socket.emit("updatePaddlePosition", {roomName: global.roomName, playerId: global.playerId, y: global.player2Y});
				});
			}
			else
				global.setCountdownDisappear?.(true);
			global.socket.emit("initializeScorePanel", global.roomName);
			global.gameStarted = true;
		}
	}
}

function	addSocketEventHandlers(setCurrentPlayersData: Function, setGameScore: Function) {
	global.socket.off("newCoordinates").on("newCoordinates", (data) => {
		setReceivedSocketData(data, setGameScore);
		render();
	});

	global.socket.off("theWinner").on("theWinner", (theWinner) => {
		global.winnerId = theWinner;
		global.setForceChange?.(true);
	});

	global.socket.off("scorePanelData").on("scorePanelData", async (currentPlayersId) => {
		console.log(`scorePanel is fired ${currentPlayersId}`);
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

function PingPong(): JSX.Element
{
	const	navigate: NavigateFunction = useNavigate();
	const	[gameScore, setGameScore] = useState({
		firstPlayerScore: 0,
		secondPlayerScore: 0
	});
	const	[currentPlayersData, setCurrentPlayersData] = useState<CurrentPlayersType>({
			firstPlayerName: "",
			firstPlayerAvatar: "",
			secondPlayerName: "",
			secondPlayerAvatar: "",
	});
	const	[forceChange, setForceChange] = useState(false);

	global.setForceChange = setForceChange;
	global.navigate = navigate;

	useEffect(() => {
		window.onbeforeunload = () => { return "" };
		addSocketEventHandlers(setCurrentPlayersData, setGameScore);

		if (global.secondPlayerExist === false)
			global.navigate?.("/");

		return () => {
			window.onbeforeunload = null;
			resetGame();
			global.socket.disconnect();
		};
	}, []);

	if (global.secondPlayerExist === true)
	{
		return (
			<gameContext.Provider value={{currentPlayersData, setCurrentPlayersData}}>
				<>
					{forceChange ? <ResultPrompt /> : <CountDown />}
					<div className="game_canvas_parent_container flex-center-column">
						<div className="container_sesco flex-center-column flex-gap20">
							<Score s1={gameScore.firstPlayerScore} s2={gameScore.secondPlayerScore} />
							<Canvas game={game} width={global.canvasWidth} height={global.canvasHeight} />
						</div>
					</div>
				</>
			</gameContext.Provider>
		);
	}
	return (
		<></>
	);
}

export default PingPong;