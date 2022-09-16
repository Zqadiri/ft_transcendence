import React, { useEffect, useState } from 'react';
import "../../styles/game-styling.css";
import Canvas from './Canvas';
import Score from './Score';
import { global, GameData } from './data/PingPong.d';
import { renderTheme1 } from "./RenderTheme1";
import { renderTheme2 } from "./RenderTheme2";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useEffectOnce } from "./Game"

const resetGame = (): void => {
	global.player1X = 0;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player1Score = 0;

	global.player2X = global.canvasWidth - global.paddleWidth;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player2Score = 0;

	global.ballX = global.canvasWidth/2;
	console.log(global.canvasWidth);
	global.ballY = global.canvasHeight/2;
	console.log(global.canvasHeight);
	global.gameStarted = false;
	global.roomName = "none"
	global.playerId = 0;
	global.secondPlayerExist = false;
}

const render = (): void => {
	if (global.theme === "theme1")
		renderTheme1();
	else if (global.theme === "theme2")
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
		global.setScore1?.(global.player1Score);
	}
	else if (data.p2.score !== global.player2Score)
	{
		global.player2Score = data.p2.score;
		global.setScore2?.(global.player2Score);
	}
}

function CountDown(): JSX.Element {
	
	const [disappear, setDesppear] = useState(false);

	global.setDisappear = setDesppear;
	return (
		<section className={`${disappear ? "count-down-disabled" : "count-down"}`}>
			 <div className="number">
				<h2>3</h2>
			</div>
			 <div className="number">
				<h2>2</h2>
			</div>
			 <div className="number">
				<h2>1</h2>
			</div>
		</section>
	);
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
					global.setDisappear?.(true);
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
					global.setDisappear?.(true);
				}, 3000);
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					global.player2Y = event.clientY - rect.top - global.paddleHeight/2;
					global.socket.emit("updatePaddlePosition", {roomName: global.roomName, playerId: global.playerId, y: global.player2Y});
				});
			}
			global.gameStarted = true;
		}
	}
}

const setTheWinner = (theWinner: number): void => {
	global.winnerId = theWinner;
	global.setForceChange?.(true);
}

const goHome = (): void => {
	setTimeout(() => {
		global.winnerId = 0;
		resetGame();
		global.navigate?.("/");
	}, 3000)
}

function ResultPrompt(): JSX.Element {
	let		resultMessage: string;
	let		winnerName: string = "You";
	let		mainColor: string;

	if (global.playerId > 2)
	{
		winnerName = "Player " + global.winnerId;
		resultMessage = "Won The Game";
		mainColor = "#f66b0e";
	}
	else if (global.playerId === global.winnerId)
	{
		resultMessage = "Won The Game";
		mainColor = "#6a994e";
	}
	else 
	{
		resultMessage = "Lost The Game";
		mainColor = "#d62828";
	}

	return (
		<>
			<section className="result-overlay">
				<div className="prompt">
					<span style={{color: mainColor}}>{winnerName}</span>
					<span style={{backgroundColor: mainColor}}>{resultMessage}</span>
				</div>
			</section>
			{goHome()}
		</>
	);
}

function PingPong(): JSX.Element
{
	const navigate: NavigateFunction = useNavigate();
	const [score1, setScore1] = useState(global.player1Score);
	const [score2, setScore2] = useState(global.player2Score);
	const [forceChange, setForceChange] = useState(false);

	global.setScore1 = setScore1;
	global.setScore2 = setScore2;
	global.setForceChange = setForceChange;
	global.navigate = navigate;

	useEffectOnce(() => {
		global.socket.off("newCoordinates").on("newCoordinates", (data) => {
			setUserData(data);
			render();
		});
		global.socket.off("theWinner").on("theWinner", (theWinner) => {
			setTheWinner(theWinner);
		});

	});

	useEffect(() => {
		window.onbeforeunload = () => { return "" };

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
			<>
				<CountDown />
				{forceChange ? <ResultPrompt /> : null}
				<div className="container_sesco">
					<Score s1={score1} s2={score2} />
					<Canvas game={game} width={global.canvasWidth} height={global.canvasHeight} />
				</div>
			</>
		);
	}

	return (
		<></>
	);
}

export default PingPong;