import Game, { socket, useEffectOnce, roomName, setRoomName, playerId } from "./Game";
import { useNavigate } from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { useState, useEffect } from "react";
import MoonLoader from 'react-spinners/MoonLoader';
import { ReactComponent as GameTheme01 } from './theme#01.svg';
import { ReactComponent as GameTheme02 } from './theme#02.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

export let	theme: string = "none";
export let	secondPlayerExist: boolean = false;
let			g_switchContent: boolean = true;

export const setSecondPlayerExist = (value: boolean): void => {
	secondPlayerExist = value;
}

export const setTheme = (value: string): void => {
	theme = value;
}

function	GameRules(): JSX.Element {
	return (
		<section className="game-rules">
				<h2>Game Rules</h2>
			<div className="rules-list">
				<ol>
					<li><span>(1)</span> To win you need to score 10 balls against your opponent.</li>
					<li><span>(2)</span> You will play with your mouse.</li>
					<li><span>(3)</span> To move your paddle you need to point the cursor inside the game canvas.</li>
					<li><span>(4)</span> While you play the speed of the ball increases.</li>
					<li><span>(5)</span> Second theme starting speed is higher than the first theme.</li>
				</ol>
			</div>
		</section>
	);
}

function	Selection({setSwitchContent}: InferProps<typeof Selection.propTypes>): JSX.Element {
	const [activeTheme, setActiveTheme] = useState("none");
	const joinRoom = ():void =>
	{
		if (activeTheme !== "none")
		{
			setSwitchContent(false);
			g_switchContent = false;
		}
		if (activeTheme === "theme1")
			socket.emit("joinTheme1");
		else if (activeTheme === "theme2")
			socket.emit("joinTheme2");
		theme = activeTheme;
	}
	return (
		<>
			<div className="matching-container" >
				<div
					onClick={() => {
						setActiveTheme(activeTheme === "theme1" ? "none" : "theme1");
					}}
					className={`${activeTheme === "theme1" ? "active-theme" : ""}`}
				>
					<GameTheme01 />
				</div>
				<div
					onClick={() => {
						setActiveTheme(activeTheme === "theme2" ? "none" : "theme2");
					}}
					className={`${activeTheme === "theme2" ? "active-theme" : ""}`}
				>
					<GameTheme02 />
				</div>
			</div>
			<div className={`${activeTheme !== "none" ? "match-me" : "match-me-disabled"}`}>
				<button onClick={joinRoom}>Match Me</button>
			</div>
			<GameRules />
		</>
	);
}

function	Waiting({setSwitchContent}: InferProps<typeof Selection.propTypes>): JSX.Element
{
	const	cancelRoom = () => {
		g_switchContent = true;
		setSwitchContent(true);
		socket.emit("cancelRoom", {roomName, theme});
	}

	useEffect(() => {
		window.onbeforeunload = () => { return "" };

		
		return () => {
			if (g_switchContent === false)
			{
				alert("You matching is about to be canceled");
				g_switchContent = true;
			}
			if (secondPlayerExist === false)
				socket.emit("cancelRoom", {roomName, theme});
			window.onbeforeunload = null;
		};
	}, []);

	return (
		<>
			<div className="spinner-container" >
				<MoonLoader color={'#F66B0E	'} speedMultiplier={0.4} size={25} />
			</div>
			<div className="cancel-button">
				<p>
					Waiting for the second player...
				</p>
				<button onClick={cancelRoom}>Cancel</button>
			</div>
		</>
	);
}

function	Matching(): JSX.Element
{
	const	[switchContent, setSwitchContent] = useState(g_switchContent);
	const 	navigate = useNavigate();

	useEffectOnce(() => {
		socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
			setRoomName(room, playerId);
		});
		socket.off("secondPlayerJoined").on("secondPlayerJoined", () => {
			setSecondPlayerExist(true);
			g_switchContent = true;
			navigate("/play");
		});
	});

	return (
		<>
			{switchContent ? <Selection setSwitchContent={setSwitchContent}/> : <Waiting setSwitchContent={setSwitchContent}/>}
		</>
	);
}

Selection.propTypes = {
	setSwitchContent: PropTypes.func.isRequired
}

Waiting.propTypes = {
	setSwitchContent: PropTypes.func.isRequired
}

export default Matching;