import React, { useState } from 'react';
import '../App.css';
import Canvas from './Canvas';
import Score from './Score';

let g_setScore1: React.Dispatch<React.SetStateAction<number>>;
let g_setScore2: React.Dispatch<React.SetStateAction<number>>;

const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 600,
	color: "black"
}

type Users = {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	score: number,
}

type Directions = {
	top: number,
	down: number,
	left: number,
	right: number
}

const user1: Users = {
	x: 0,
	y: canvas.height/2 - 200/2,
	width: 30,
	height: 200,
	color: "WHITE",
	score: 0,
}

const user2: Users = {
	x: canvas.width - 30,
	y: canvas.height/2 - 200/2,
	width: user1.width,
	height: user1.height,
	color: "WHITE",
	score: 0,
}

const ball:
{x: number, y: number, speed: number, velocityX: number, velocityY: number, radius: number, color: string} = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	speed: 12,
	velocityX: 11,
	velocityY: 11,
	radius: 20,
	color: "WHITE"
}

const net: {x: number, y: number, width: number, height: number, color: string} = {
	x: canvas.width / 2 - 2/2,
	y: 0,
	width: 2,
	height: 10,
	color: "WHITE"
}

const drawRect = (x: number, y: number, w: number, h: number, color: string): void =>
{
	if (canvas.context !== null)
	{
		canvas.context.fillStyle = color;
		canvas.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number, color: string): void =>
{
	if (canvas.context !== null)
	{
		canvas.context.fillStyle = color;
		canvas.context.beginPath();
		canvas.context.arc(x, y, r, 0, Math.PI*2, false);
		canvas.context.closePath();
		canvas.context.fill();
	}
}

const drawNet = (): void =>
{
	for (let i: number = 0; i < canvas.height; i += (net.height + 15))
		drawRect(net.x, i, net.width, net.height, net.color);
}

const render = (): void =>
{
	drawRect(0, 0, canvas.width, canvas.height, canvas.color);
	drawNet();
	drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
	drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const hasCollided = (player: Users): boolean =>
{
	const b: Directions = {
		top: ball.y - ball.radius,
		down: ball.y + ball.radius,
		left: ball.x - ball.radius,
		right: ball.x + ball.radius
	}
	const p: Directions = {
		top: player.y,
		down: player.y + player.height,
		left: player.x,
		right: player.x + player.width
	}
	return (b.left < p.right && b.down > p.top && b.right > p.left && b.top < p.down);
}

const update_score = (): void =>
{
	if (ball.x - ball.radius < 0)
	{
		user2.score += 1;
		g_setScore2(user2.score);
	}
	else if (ball.x + ball.radius > canvas.width)
	{
		user1.score += 1;
		g_setScore1(user1.score);
	}

	if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width)
	{
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = 12;
		ball.velocityX = ball.velocityX < 0 ? 11 : -11;
		ball.velocityY = 11;
	}
}

const update = (): void =>
{
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
	{
		ball.velocityY = -ball.velocityY;
		return;
	}
	
	let	player: Users = ball.x < canvas.width/2 ? user1 : user2;

	if (hasCollided(player))
	{
		console.log("before", ball.velocityX, ball.velocityY);
		let collidePoint: number = ball.y - (player.y + player.height/2);
		let direction: number = ball.x < canvas.width/2 ? 1 : -1;
		// normalize
		collidePoint /= player.height/2;
		let angle: number = collidePoint * (Math.PI/4);

		ball.velocityX = (ball.speed * Math.cos(angle)) * direction;
		ball.velocityY = ball.speed * Math.sin(angle);

		ball.speed += 0.5;
		console.log("after", ball.velocityX, ball.velocityY);
	}
	else
		update_score();
}

const pongGame = () =>
{
	update();
	render();
}

function moveUser1Paddle(event: KeyboardEvent): void
{
	let move: number = 0;

	if (event.key === "ArrowUp")
		move = -20;
	else if (event.key === "ArrowDown")	
		move = 20;

	if ((user1.y + user1.height/2) + move > 0 && (user1.y + user1.height/2) + move < canvas.height)
		user1.y += move;
}

let gameStarted: boolean = false;

function startGame(event: KeyboardEvent): void
{
	if (!gameStarted && event.key === " ") {
		setInterval(() => {
			pongGame();
		}, 1000/50);
		gameStarted = true;
	}
}

const game = (current: HTMLCanvasElement | null): void =>
{
	if (current !== null)
	{
		canvas.context = current.getContext("2d");
		render();
		window.addEventListener("keydown" , moveUser1Paddle);
		window.addEventListener("keydown" , startGame);
		current.addEventListener("mousemove" , (event: MouseEvent) => {
			user2.y = event.clientY - user2.height/2;
		});
	}
}

function PingPong(): JSX.Element {
	let [score1, setScore1] = useState(user1.score);
	let [score2, setScore2] = useState(user2.score);

	g_setScore1 = setScore1;
	g_setScore2 = setScore2;
	return (
		<div className="container">
			<Score s1={score1} s2={score2} />
			<Canvas game={game} width={canvas.width} height={canvas.height} />
		</div>
	);
}

export default PingPong;
