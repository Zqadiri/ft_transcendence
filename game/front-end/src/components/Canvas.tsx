import PropTypes from 'prop-types';
import React from 'react'

function Canvas( {game, width, height}: {game: (context: CanvasRenderingContext2D | null) => void; width: number; height: number} ): JSX.Element {
	const canvas: React.RefObject<HTMLCanvasElement> = React.useRef(null);

	React.useEffect(() => {
		if (canvas.current !== null)
		{
			const context = canvas.current.getContext("2d");
			game(context);
		}
	});

	return (
		<canvas ref={canvas} width={width} height={height}></canvas>
	);
}

Canvas.propTypes = {
	game: PropTypes.func.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired
}

export default Canvas;