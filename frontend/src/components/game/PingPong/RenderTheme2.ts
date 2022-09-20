import { global } from '../data/PingPong.d';
import { canvasHeight, canvasWidth, netHeight, netWidth, netX, paddleHeight, paddleWidth, player1X, player2X } from './pingPong.contants';
import { theme2 } from './theme.d';

const drawPlayground = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let grd = global.context.createRadialGradient(canvasWidth/2, canvasHeight/2, 100, canvasWidth/2, canvasHeight/2, 500);

		grd.addColorStop(0, theme2.canvas.firstColor);
		grd.addColorStop(1, theme2.canvas.secondColor);

		global.context.fillStyle = grd;
		global.context.fillRect(x, y, w, h);
	}
}


const drawLeftPaddle = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let linear = global.context.createLinearGradient(player1X, 0, paddleWidth, 0);

		linear.addColorStop(0, theme2.player1.firstColor);
		linear.addColorStop(1, theme2.player1.secondColor);

		global.context.fillStyle =linear ;
		global.context.fillRect(x, y, w, h);
	}
}

const drawRightPaddle = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let linear = global.context.createLinearGradient(player2X, 0, player2X + paddleWidth, 0);

		linear.addColorStop(0, theme2.player2.firstColor);
		linear.addColorStop(1, theme2.player2.secondColor);

		global.context.fillStyle = linear;
		global.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number): void => {
	if (global.context !== null) {
		let grd = global.context.createRadialGradient(x, y, 5, x, y, 15);

		grd.addColorStop(0, theme2.ball.firstColor);
		grd.addColorStop(1, theme2.ball.secondColor);

		global.context.fillStyle = grd;
		global.context.beginPath();
		global.context.arc(x, y, r, 0, Math.PI * 2, false);
		global.context.closePath();
		global.context.fill();
	}
}

const drawRect = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let linear = global.context.createLinearGradient(0, 0, 0, netX);

		linear.addColorStop(0, theme2.net.firstColor);
		linear.addColorStop(0.61, theme2.net.secondColor);
		linear.addColorStop(1, theme2.net.firstColor);

		global.context.fillStyle = linear;
		global.context.fillRect(x, y, w, h);
	}
}

const drawNet = (): void => {
	for (let i: number = 0; i < canvasHeight; i += (netHeight + 15))
		drawRect(netX, i, netWidth, netHeight);
}

export const renderTheme2 = (): void => {
	drawPlayground(0, 0, canvasWidth, canvasHeight);
	drawNet();
	drawLeftPaddle(player1X, global.player1Y, paddleWidth, paddleHeight);
	drawRightPaddle(player2X, global.player2Y, paddleWidth, paddleHeight);
	drawCircle(global.ballX, global.ballY, theme2.ball.radius);
}