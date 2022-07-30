import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import Canvas from './Canvas';
import { stringify } from 'querystring';
import { couldStartTrivia, EndOfLineState, updateLanguageServiceSourceFile } from 'typescript';

const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 700,
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
	speed: 5,
	velocityX: 5,
	velocityY: 5,
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
	return (b.left > p.right && b.down > p.top && b.right > p.left && b.top > p.down);
}

const update_score = (): void =>
{
	if (ball.x - ball.radius < 0)
		user1.score += 1;
	else if (ball.x + ball.radius > canvas.width)
		user2.score += 1;

	if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width)
	{
		console.log("user1:", user1.score, "user2:", user2.score);
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = 5;
		ball.velocityX = -ball.velocityX;
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
		let collidePoint: number = ball.y - (player.y + player.height/2);
		let direction: number = ball.x < canvas.width/2 ? 1 : -1;
		// normalize
		collidePoint /= player.height/2;
		let angle: number = collidePoint * (Math.PI/4);

		ball.velocityX = (ball.speed * Math.cos(angle)) * direction;
		ball.velocityY = ball.speed * Math.sin(angle);

		// ball.speed += 0.1;
	}
	else
		update_score();
}

const game = (ctx: CanvasRenderingContext2D | null): void =>
{
	canvas.context = ctx;
	// update();
	render();
}

function PingPong(): JSX.Element {
	console.log("user1:", user1.score, "user2:", user2.score);
	return (<Canvas game={game} width={canvas.width} height={canvas.height} />);
}

export default PingPong;
