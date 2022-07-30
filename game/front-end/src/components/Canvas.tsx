import PropTypes from 'prop-types';
import React from 'react'

function Canvas( {draw, width, height}: {draw: (context: CanvasRenderingContext2D | null) => void; width: number; height: number} ): JSX.Element {
	const canvas: React.RefObject<HTMLCanvasElement> = React.useRef(null);

	React.useEffect(() => {
		if (canvas.current !== null)
		{
			const context = canvas.current.getContext('2d');
			draw(context);
		}
	});

	return (
		<canvas ref={canvas} width={width} height={height}></canvas>
	);
}

Canvas.propTypes = {
	draw: PropTypes.func.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired
}

export default Canvas;