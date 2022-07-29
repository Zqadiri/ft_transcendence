import PropTypes from 'prop-types';

function Canvas( {draw, width, height}: {draw: () => void; width: number; height: number} ): JSX.Element {
	return (
		<canvas id="pong" width={width} height={height}></canvas>
	);
}

Canvas.propTypes = {
	draw: PropTypes.func.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired
}

export default Canvas;
