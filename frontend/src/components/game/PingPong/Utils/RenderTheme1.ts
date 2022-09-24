import { canvas, global } from '../Data/PingPong.d';
import { player1X } from '../Data/PingPong.contants';
import { theme1 } from '../Data/Themes.d';

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
	for (let i: number = 0; i < canvas.height; i += (canvas.width * 0.015))
		drawRect(canvas.netX, i, canvas.netWidth, canvas.netHeight, theme1.net.color);
}

export const renderTheme1 = (): void => {
	drawRect(0, 0, canvas.width, canvas.height, theme1.canvas.color);
	drawNet();
	drawRect(player1X, global.player1Y, canvas.paddleWidth, canvas.paddleHeight, theme1.player1.color);
	drawRect(canvas.player2X, global.player2Y, canvas.paddleWidth, canvas.paddleHeight, theme1.player2.color);
	drawCircle(global.ballX, global.ballY, canvas.ballRadius, theme1.ball.color);
}