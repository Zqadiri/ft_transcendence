import PropTypes from 'prop-types';
import React, { useState } from 'react'
import { canvas, global } from './Data/PingPong.d';
import { splitPaddleControl } from './PingPong';

function	setResponsiveDimensions(width: number, height: number)
{
	canvas.width = width;
	canvas.height = height;

	canvas.paddleWidth = width * 0.02;
	canvas.paddleHeight = width * 0.15;
	canvas.player2X = width - canvas.paddleWidth;

	canvas.netWidth = width * 0.003;
	canvas.netHeight = width * 0.01;
	canvas.netX = canvas.width/2 - canvas.netWidth/2;

	canvas.ballRadius = width * 0.015;

	if (!global.gameStarted)
	{
		global.player1Y = canvas.height/2 - canvas.paddleHeight/2;
		global.player2Y = canvas.height/2 - canvas.paddleHeight/2;
		global.ballX = canvas.width/2;
		global.ballY = canvas.height/2;
	}

}

function	Canvas(): JSX.Element {
	const	Canvas: React.RefObject<HTMLCanvasElement> = React.useRef(null);
	const	[rerender, setRerender] = useState(0);

	React.useEffect(() => {
		if (Canvas.current)
		{
			window.onresize = () => {
				setRerender(rerender + 1);
			};

			Canvas.current.style.width = '100%';

			Canvas.current.width = Canvas.current.offsetWidth;
			Canvas.current.height = Canvas.current.offsetWidth * 0.6;
			setResponsiveDimensions(Canvas.current.width, Canvas.current.height);

			global.canvasRef = Canvas.current;
			global.context = Canvas.current.getContext("2d");
			splitPaddleControl();
		}

		return () => {window.onresize = null};
	});

	return (
		<canvas ref={Canvas}></canvas>
	);
}

export default Canvas;