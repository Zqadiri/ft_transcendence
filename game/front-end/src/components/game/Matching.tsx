import { socket, useEffectOnce, roomName, setRoomName } from "./Game";
import { useNavigate } from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { useState } from "react";
import MoonLoader from 'react-spinners/MoonLoader';

let		theme: string = "none";

function	Selection({setSwitchContent}: InferProps<typeof Selection.propTypes>): JSX.Element {
	const [activeTheme, setActiveTheme] = useState("none");
	const joinRoom = ():void =>
	{
		if (activeTheme !== "none")
			setSwitchContent(false);
		if (activeTheme === "theme1")
			socket.emit("joinTheme1");
		else if (activeTheme === "theme2")
			socket.emit("joinTheme2");
		theme = activeTheme;
	}
	return (
		<>
			<div className="matching-container" >
				<button
					onClick={() => {
						setActiveTheme(activeTheme === "theme1" ? "none" : "theme1");
					}}
					className={`${activeTheme === "theme1" ? "active-theme" : ""}`}
				>Theme #01</button>
				<button
					onClick={() => {
						setActiveTheme(activeTheme === "theme2" ? "none" : "theme2");
					}}
					className={`${activeTheme === "theme2" ? "active-theme" : ""}`}
				>Theme #02</button>
			</div>
			<div className="match-me">
				<button onClick={joinRoom}>Match Me</button>
			</div>
		</>
	);
}

function	Waiting({setSwitchContent}: InferProps<typeof Selection.propTypes>): JSX.Element
{
	const	leaveRoom = () => {
		setSwitchContent(true);
		socket.emit("leaveRoom", roomName, theme);
	}
	return (
		<>
			<div className="spinner-container" >
				<MoonLoader color={'#F66B0E	'} speedMultiplier={0.4} size={25} />
			</div>
			<div className="cancel-button">
				<p>
					Waiting for the second player...
				</p>
				<button onClick={leaveRoom}>Cancel</button>
			</div>
		</>
	);
}

function	Matching(): JSX.Element
{
	const	[switchContent, setSwitchContent] = useState(true);
	const 	navigate = useNavigate();
	useEffectOnce(() => {
		socket.on("joinedRoom", (data) => {
			setRoomName(data);
		});
		socket.on("secondPlayerJoined", () => {
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