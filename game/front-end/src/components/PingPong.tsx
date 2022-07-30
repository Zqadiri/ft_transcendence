import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import Canvas from './Canvas';
import { stringify } from 'querystring';

const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 700,
	color: "black"
}

const user1: {x: number, y: number, width: number, height: number, color: string, score: number} = {
	x: 0,
	y: canvas.height/2 - 200/2,
	width: 20,
	height: 200,
	color: "WHITE",
	score: 0
}

const user2: {x: number, y: number, width: number, height: number, color: string, score: number} = {
	x: canvas.width - 20,
	y: canvas.height/2 - 200/2,
	width: 20,
	height: 200,
	color: "WHITE",
	score: 0
}

const ball: {x: number, y: number, radius: number, color: string} = {
	x: canvas.width / 2,
	y: canvas.height / 2,
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

const drawRect = (x: number, y: number, w: number, h: number, color: string) =>
{
	if (canvas.context !== null)
	{
		canvas.context.fillStyle = color;
		canvas.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number, color: string) =>
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

const drawNet = () =>
{
	for (let i: number = 0; i < canvas.height; i += (net.height + 15))
	{
		console.log(i);
		drawRect(net.x, i, net.width, net.height, net.color);
	}
}

const render = () =>
{
	drawRect(0, 0, canvas.width, canvas.height, canvas.color);
	drawNet();
	drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
	drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

const game = (ctx: CanvasRenderingContext2D | null): void =>
{
	canvas.context = ctx;
	render();
}

function PingPong(): JSX.Element {
	return (<Canvas game={game} width={canvas.width} height={canvas.height} />);
}

export default PingPong;
