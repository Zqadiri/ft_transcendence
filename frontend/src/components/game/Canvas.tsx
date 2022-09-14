import PropTypes from 'prop-types';
import React from 'react'

function Canvas( {game, width, height}: {game: (context: HTMLCanvasElement | null) => void; width: number; height: number} ): JSX.Element {
	const canvas: React.RefObject<HTMLCanvasElement> = React.useRef(null);

	React.useEffect(() => {
		game(canvas.current);
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