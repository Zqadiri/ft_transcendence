import { theme2, theme1, global } from './data/PingPong.d';

const drawRect_2 = (x: number, y: number, w: number, h: number, color: string): void => {
	if (global.context !== null)
	{
		let grd = global.context.createRadialGradient(global.canvasWidth/2, global.canvasHeight/2, 20, global.canvasWidth/2, global.canvasHeight/2, 500);
		grd.addColorStop(0, theme2.canvas.firstColor);
		grd.addColorStop(1, theme2.canvas.secondColor);
		global.context.fillStyle = grd;
		global.context.fillRect(x, y, w, h);
	}
}

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

export const renderTheme2 = (): void => {
	// drawRect(0, 0, global.canvasWidth, global.canvasHeight, theme1.canvas.color);
	drawRect_2(0, 0, global.canvasWidth, global.canvasHeight, theme1.canvas.color);
	drawNet();
	drawRect(global.player1X, global.player1Y, global.paddleWidth, global.paddleHeight, theme1.player1.color);
	drawRect(global.player2X, global.player2Y, global.paddleWidth, global.paddleHeight, theme1.player2.color);
	drawCircle(global.ballX, global.ballY, theme1.ball.radius, theme1.ball.color);
}