import PropTypes from 'prop-types';
import React from 'react'
import { global } from '../data/PingPong.d';
import { splitPaddleControl } from './PingPong';

function Canvas( {width, height}: {width: number; height: number} ): JSX.Element {
	const canvas: React.RefObject<HTMLCanvasElement> = React.useRef(null);

	React.useEffect(() => {
		if (canvas.current)
		{
			global.canvasRef = canvas.current;
			global.context = canvas.current.getContext("2d");
			splitPaddleControl();
		}
	});

	return (
		<canvas ref={canvas} width={width} height={height}></canvas>
	);
}

Canvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired
}

export default Canvas;