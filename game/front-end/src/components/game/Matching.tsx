import { socket, useEffectOnce, roomName, setRoomName, playerId } from "./Game";
import { useNavigate } from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { useState, useEffect } from "react";
import MoonLoader from 'react-spinners/MoonLoader';
import { ReactComponent as GameTheme01 } from './theme#01.svg';
import { ReactComponent as GameTheme02 } from './theme#02.svg';

export let	theme: string = "none";
export let	secondPlayerExist: boolean = false;
let			g_switchContent: boolean = true;

export const setSecondPlayerExist = (value: boolean): void => {
	secondPlayerExist = value;
}

export const setTheme = (value: string): void => {
	theme = value;
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
			g_switchContent = true;
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