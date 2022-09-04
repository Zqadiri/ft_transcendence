import React, { useState } from 'react';
import './Style.css';
import Canvas from './Canvas';
import Score from './Score';
import { canvas, ball, user1, user2, net, Users, Directions } from './data/PingPong.d';
import { useNavigate, NavigateFunction } from 'react-router-dom';

// Global Variables

export let 	g_setScore1: React.Dispatch<React.SetStateAction<number>>;
export let 	g_setScore2: React.Dispatch<React.SetStateAction<number>>;
let 		gameStarted: boolean = false;
let 		intervalValue: NodeJS.Timer;
let 		g_navigate: NavigateFunction;

const resetGame = (): void => {
	user1.x = 0;
	user1.y = canvas.height / 2 - 200 / 2;
	user1.score = 0;
	user2.x = canvas.width - 20;
	user2.y = canvas.height / 2 - 200 / 2;
	user2.score = 0;

	g_setScore1(user1.score);
	g_setScore2(user2.score);

	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
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

const hasCollided = (player: Users): boolean => {
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

const update_score = (): void => {
	if (ball.x - ball.radius < 0) {
		user2.score += 1;
		g_setScore2(user2.score);
	}
	else if (ball.x + ball.radius > canvas.width) {
		user1.score += 1;
		g_setScore1(user1.score);
	}

	if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = 12;
		ball.velocityX = ball.velocityX < 0 ? 11 : -11;
		ball.velocityY = 11;
	}
}

const check_for_the_winner = (): void => {
	if (user1.score === 5)
		alert("Player 1 Has Won The Game");
	else if (user2.score === 5)
		alert("Player 2 Has Won The Game");
	else
		return;
	clearInterval(intervalValue);
	g_navigate("/");
}

const update = (): void => {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
		return;
	}

	let player: Users = ball.x < canvas.width / 2 ? user1 : user2;

	if (hasCollided(player)) {
		let collidePoint: number = ball.y - (player.y + player.height / 2);
		let direction: number = ball.x < canvas.width / 2 ? 1 : -1;
		// normalize
		collidePoint /= player.height / 2;
		let angle: number = collidePoint * (Math.PI / 4);

		ball.velocityX = (ball.speed * Math.cos(angle)) * direction;
		ball.velocityY = ball.speed * Math.sin(angle);

		ball.speed += 0.5;
	}
	else {
		update_score();
		check_for_the_winner();
	}
}

function moveUser1Paddle(event: KeyboardEvent): void {
	let move: number = 0;

	if (event.key === "ArrowUp")
		move = -20;
	else if (event.key === "ArrowDown")
		move = 20;

	if ((user1.y + user1.height / 2) + move > 0 && (user1.y + user1.height / 2) + move < canvas.height)
		user1.y += move;
}

const game = (current: HTMLCanvasElement | null): void => {
	if (current !== null) {
		canvas.context = current.getContext("2d");
		render();
		window.addEventListener("keydown", moveUser1Paddle);
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			if (!gameStarted && event.key === " ") {
				intervalValue = setInterval(() => {
					update();
					render();
				}, 1000 / 50);
				gameStarted = true;
			}
			else if (gameStarted && event.key === "Escape") {
				resetGame();
				render();
				clearInterval(intervalValue);
				gameStarted = false;
			}
		});
		current.addEventListener("mousemove", (event: MouseEvent) => {
			let rect = current.getBoundingClientRect();
			user2.y = event.clientY - rect.top - user2.height / 2;
		});
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
	return (
		<div className="container">
			<Score s1={score1} s2={score2} />
			<Canvas game={game} width={canvas.width} height={canvas.height} />
		</div>
	);
}

export default PingPong;