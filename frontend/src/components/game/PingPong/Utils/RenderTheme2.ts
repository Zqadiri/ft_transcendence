import { canvas, global } from '../Data/PingPong.d';
import { player1X } from '../Data/PingPong.contants';
import { theme2 } from '../Data/Themes.d';

const drawPlayground = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let grd = global.context.createRadialGradient(canvas.width/2, canvas.height/2, (canvas.width * 0.1), canvas.width/2, canvas.height/2, (canvas.width * 0.5));

		grd.addColorStop(0, theme2.canvas.firstColor);
		grd.addColorStop(1, theme2.canvas.secondColor);

		global.context.fillStyle = grd;
		global.context.fillRect(x, y, w, h);
	}
}


const drawLeftPaddle = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let linear = global.context.createLinearGradient(player1X, 0, canvas.paddleWidth, 0);

		linear.addColorStop(0, theme2.player1.firstColor);
		linear.addColorStop(1, theme2.player1.secondColor);

		global.context.fillStyle =linear ;
		global.context.fillRect(x, y, w, h);
	}
}

const drawRightPaddle = (x: number, y: number, w: number, h: number): void => {
	if (global.context !== null)
	{
		let linear = global.context.createLinearGradient(canvas.player2X, 0, canvas.player2X + canvas.paddleWidth, 0);

		linear.addColorStop(0, theme2.player2.firstColor);
		linear.addColorStop(1, theme2.player2.secondColor);

		global.context.fillStyle = linear;
		global.context.fillRect(x, y, w, h);
	}
}

const drawCircle = (x: number, y: number, r: number): void => {
	if (global.context !== null) {
		let grd = global.context.createRadialGradient(x, y, (5 * 0.34), x, y, r);

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
		let linear = global.context.createLinearGradient(0, 0, 0, canvas.netX);

		linear.addColorStop(0, theme2.net.firstColor);
		linear.addColorStop(0.61, theme2.net.secondColor);
		linear.addColorStop(1, theme2.net.firstColor);

		global.context.fillStyle = linear;
		global.context.fillRect(x, y, w, h);
	}
}

const drawNet = (): void => {
	for (let i: number = 0; i < canvas.height; i += (canvas.width * 0.015))
		drawRect(canvas.netX, i, canvas.netWidth, canvas.netHeight)
}

export const renderTheme2 = (): void => {
	drawPlayground(0, 0, canvas.width, canvas.height);
	drawNet();
	drawLeftPaddle(player1X, global.player1Y, canvas.paddleWidth, canvas.paddleHeight);
	drawRightPaddle(canvas.player2X, global.player2Y, canvas.paddleWidth, canvas.paddleHeight);
	drawCircle(global.ballX, global.ballY, canvas.ballRadius);
}