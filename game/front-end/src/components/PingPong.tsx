import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import Canvas from './Canvas';
import { stringify } from 'querystring';

const draw = (context: CanvasRenderingContext2D | null): void => {

}

function PingPong(): JSX.Element {
	return (<Canvas draw={draw} width={600} height={400} />);
}

export default PingPong;
