import React, { useState } from 'react';
import './Style.css';
import Canvas from './Canvas';
import Score from './Score';
import { global, GameData } from './data/PingPong.d';
import { renderTheme1 } from "./RenderTheme1";
import { renderTheme2 } from "./RenderTheme2";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { socket, useEffectOnce, roomName, setRoomName, playerId } from "../game/Game";
import { theme } from "../game/Matching"

// Global Variables

export let 	g_setScore1: React.Dispatch<React.SetStateAction<number>>;
export let 	g_setScore2: React.Dispatch<React.SetStateAction<number>>;
let 		gameStarted: boolean = false;
let 		g_navigate: NavigateFunction;

const resetGame = (): void => {
	global.player1X = 0;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player1Score = 0;

	global.player2X = global.canvasWidth - global.paddleWidth;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player2Score = 0;

	global.ballX = global.canvasWidth/2;
	global.ballY = global.canvasHeight/2;
	gameStarted = false;
	setRoomName("none", 0);
}

const setTheWinner = (theWinner: number): void => {
	if (playerId > 2)
		alert("Player " + theWinner + " Has Won The Game");
	else if (playerId === theWinner)
		alert("You've Won The Game");
	else 
		alert("You've Lost The Game");
	socket.emit("leaveRoom", roomName);
	resetGame();
	g_navigate("/");
}

const render = (): void => {
	// if (theme === "theme1")
		// renderTheme1();
	// else if (theme === "theme2")
		renderTheme2();
}

const setUserData = (data: GameData): void => {
	global.player1X = data.p1.x;
	global.player1Y = data.p1.y;
	global.player2X = data.p2.x;
	global.player2Y = data.p2.y;
	global.ballX = data.b.x;
	global.ballY = data.b.y;

	if (data.p1.score !== global.player1Score)
	{
		global.player1Score = data.p1.score;
		g_setScore1(global.player1Score);
	}
	else if (data.p2.score !== global.player2Score)
	{
		global.player2Score = data.p2.score;
		g_setScore2(global.player2Score);
	}
}

const game = (current: HTMLCanvasElement | null): void => {
	if (current !== null) {
		global.context = current.getContext("2d");
		render();

		if (!gameStarted)
		{
			if (playerId === 1)
			{
				socket.emit("gameIsStarted", roomName);
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					global.player1Y = event.clientY - rect.top - global.paddleHeight/2;
					const y: number = global.player1Y; // please update this approach, get value y from user1.y
					socket.emit("updatePaddlePosition", {roomName, playerId, y});
				});
			}
			else if (playerId === 2)
			{
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					global.player2Y = event.clientY - rect.top - global.paddleHeight/2;
					const y: number = global.player2Y;
					socket.emit("updatePaddlePosition", {roomName, playerId, y});
				});
			}
			gameStarted = true;
		}
	}
}

function PingPong(): JSX.Element
{
	const navigate: NavigateFunction = useNavigate();
	const [score1, setScore1] = useState(global.player1Score);
	const [score2, setScore2] = useState(global.player2Score);

	g_setScore1 = setScore1;
	g_setScore2 = setScore2;
	g_navigate = navigate;
	useEffectOnce(() => {
		socket.off("newCoordinates").on("newCoordinates", (data) => {
			setUserData(data);
			render();
		});
		socket.off("theWinner").on("theWinner", (theWinner) => {
			setTheWinner(theWinner);
		});
	});
	return (
		<div className="container">
			<Score s1={score1} s2={score2} />
			<Canvas game={game} width={global.canvasWidth} height={global.canvasHeight} />
		</div>
	);
}

export default PingPong;