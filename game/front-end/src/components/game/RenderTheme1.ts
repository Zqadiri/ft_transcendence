import { theme1, global } from './data/PingPong.d';

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
	for (let i: number = 0; i < global.canvasHeight; i += (global.netHeight + 15))
	drawRect(global.netX, i, global.netWidth, global.netHeight, theme1.net.color);
}

export const renderTheme1 = (): void => {
	drawRect(0, 0, global.canvasWidth, global.canvasHeight, theme1.canvas.color);
	drawNet();
	drawRect(global.player1X, global.player1Y, global.paddleWidth, global.paddleHeight, theme1.player1.color);
	drawRect(global.player2X, global.player2Y, global.paddleWidth, global.paddleHeight, theme1.player2.color);
	drawCircle(global.ballX, global.ballY, theme1.ball.radius, theme1.ball.color);
}