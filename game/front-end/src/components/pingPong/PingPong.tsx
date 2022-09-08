import React, { useState } from 'react';
import './Style.css';
import Canvas from './Canvas';
import Score from './Score';
import { canvas, ball, user1, user2, net, Users, GameData } from './data/PingPong.d';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { socket, useEffectOnce, roomName, setRoomName, playerId } from "../game/Game";

// Global Variables

export let 	g_setScore1: React.Dispatch<React.SetStateAction<number>>;
export let 	g_setScore2: React.Dispatch<React.SetStateAction<number>>;
let 		gameStarted: boolean = false;
let 		g_navigate: NavigateFunction;

const resetGame = (): void => {
	user1.x = 0;
	user1.y = canvas.height / 2 - 200 / 2;
	user1.score = 0;

	user2.x = canvas.width - 20;
	user2.y = canvas.height / 2 - 200 / 2;
	user2.score = 0;

	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
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

const drawRect = (x: number, y: number, w: number, h: number, color: string): void => {
	if (canvas.context !== null) {
		canvas.context.fillStyle = color;
		canvas.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number, color: string): void => {
	if (canvas.context !== null) {
		canvas.context.fillStyle = color;
		canvas.context.beginPath();
		canvas.context.arc(x, y, r, 0, Math.PI * 2, false);
		canvas.context.closePath();
		canvas.context.fill();
	}
}

const drawNet = (): void => {
	for (let i: number = 0; i < canvas.height; i += (net.height + 15))
	drawRect(net.x, i, net.width, net.height, net.color);
}

const render = (): void => {
	drawRect(0, 0, canvas.width, canvas.height, canvas.color);
	drawNet();
	drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
	drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const setUserData = (data: GameData): void => {
	user1.x = data.p1.x;	
	user1.y = data.p1.y;	
	user2.x = data.p2.x;	
	user2.y = data.p2.y;	
	ball.x = data.b.x;
	ball.y = data.b.y;
	if (data.p1.score !== user1.score)
	{
		user1.score = data.p1.score;
		g_setScore1(user1.score);
	}
	else if (data.p2.score !== user2.score)
	{
		user2.score = data.p2.score;
		g_setScore2(user2.score);
	}
}

const game = (current: HTMLCanvasElement | null): void => {
	if (current !== null) {
		canvas.context = current.getContext("2d");
		render();

		if (!gameStarted)
		{
			if (playerId === 1)
			{
				socket.emit("gameIsStarted", roomName);
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					user1.y = event.clientY - rect.top - user1.height / 2;
					const y: number = user1.y; // please update this approach, get value y from user1.y
					socket.emit("updatePaddlePosition", {roomName, playerId, y});
				});
			}
			else if (playerId === 2)
			{
				current.addEventListener("mousemove", (event: MouseEvent) => {
					let rect = current.getBoundingClientRect();
					user2.y = event.clientY - rect.top - user2.height / 2;
					const y: number = user2.y;
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
	const [score1, setScore1] = useState(user1.score);
	const [score2, setScore2] = useState(user2.score);

	g_setScore1 = setScore1;
	g_setScore2 = setScore2;
	g_navigate = navigate;
	useEffectOnce(() => {
		socket.off("theWinner").on("theWinner", (theWinner) => {
			setTheWinner(theWinner);
		});
		socket.off("newCoordinates").on("newCoordinates", (data) => {
			setUserData(data);
			render();
		});
	});
	return (
		<div className="container">
			<Score s1={score1} s2={score2} />
			<Canvas game={game} width={canvas.width} height={canvas.height} />
		</div>
	);
}

export default PingPong;