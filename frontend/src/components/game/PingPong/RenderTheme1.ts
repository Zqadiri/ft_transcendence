import { global } from '../data/PingPong.d';
import { canvasHeight, canvasWidth, netHeight, netWidth, netX, paddleHeight, paddleWidth, player1X, player2X } from './pingPong.contants';
import { theme1 } from './theme.d';

const drawRect = (x: number, y: number, w: number, h: number, color: string): void => {
	if (global.context !== null)
	{
		global.context.fillStyle = color;
		global.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number, color: string): void => {
	if (global.context !== null) {
		global.context.fillStyle = color;
		global.context.beginPath();
		global.context.arc(x, y, r, 0, Math.PI * 2, false);
		global.context.closePath();
		global.context.fill();
	}
}

const drawNet = (): void => {
	for (let i: number = 0; i < canvasHeight; i += (netHeight + 15))
	drawRect(netX, i, netWidth, netHeight, theme1.net.color);
}

export const renderTheme1 = (): void => {
	drawRect(0, 0, canvasWidth, canvasHeight, theme1.canvas.color);
	drawNet();
	drawRect(player1X, global.player1Y, paddleWidth, paddleHeight, theme1.player1.color);
	drawRect(player2X, global.player2Y, paddleWidth, paddleHeight, theme1.player2.color);
	drawCircle(global.ballX, global.ballY, theme1.ball.radius, theme1.ball.color);
}