import "../../../styles/game-styling.scss";

import { createContext, useEffect, useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';

import Canvas from './Canvas';
import Score from './Score';
import ResultPrompt from './ResultPrompt';
import CountDown from './CountDown';

import { global } from './Data/PingPong.d';
import { addSocketEventHandlers, handleLeftPaddle, handleRightPaddle, renderCanvas, resetGame } from './Utils/tools';
import { CurrentPlayersData } from '../Interfaces/CurrentPlayersData.interface';
import { playerOne, playerTwo, spectator } from './Data/PingPong.contants';
import { statusSocket } from "../../..";

export let gameContext = createContext<any>({});

export function splitPaddleControl()
{
	renderCanvas();
	if (global.gameStarted === false)
	{
		if (global.playerId === playerOne)
			handleLeftPaddle();
		else if (global.playerId === playerTwo)
			handleRightPaddle();
		else if (global.playerId === spectator)
		{
			global.setCountdownDisappear?.(true);
			global.socket.emit("initializeScorePanel", global.roomName);
		}

		global.gameStarted = true;
	}
}

function	PingPong(): JSX.Element
{
	const	[gameScore, setGameScore] = useState({
		firstPlayer: 0,
		secondPlayer: 0
	});
	const	[currentPlayersData, setCurrentPlayersData] = useState<CurrentPlayersData>({
			firstPlayerName: "",
			secondPlayerName: "",
			firstPlayerAvatar: "",
			secondPlayerAvatar: "",
	});
	const	[gameFinished, setGameFinished] = useState(false);
	const	navigate: NavigateFunction = useNavigate();

	useEffect(() => {
		window.onbeforeunload = () => { return "" };
		addSocketEventHandlers(setCurrentPlayersData, setGameScore, setGameFinished);

		if (global.secondPlayerExist === false)
			navigate("/");

		return () => {
			if (global.playerId !== spectator && global.playerId === 1)
				statusSocket.emit("updateStatus", "online");
			else if (global.playerId !== spectator && global.playerId === 2)
			{
				setTimeout(() => {
					statusSocket.emit("updateStatus", "online");
				}, 500);
			}
			window.onbeforeunload = null;
			global.socket.disconnect();
			resetGame();
			// location.reload();
		};
	}, []);

	if (global.secondPlayerExist === false) return (<></>);
	return (
		<gameContext.Provider value={{currentPlayersData, setCurrentPlayersData, navigate}}>
			<>
				{gameFinished ? <ResultPrompt /> : <CountDown />}
				<div className="game_canvas_parent_container flex-center-column">
					<div className="container_sesco flex-center-column">
						<Score s1={gameScore.firstPlayer} s2={gameScore.secondPlayer} />
						<Canvas />
					</div>
				</div>
			</>
		</gameContext.Provider>
	);
}

export default PingPong;