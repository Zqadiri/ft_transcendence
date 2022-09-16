import { useEffectOnce } from "./Game";
import { useNavigate } from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { useState, useEffect } from "react";
import MoonLoader from 'react-spinners/MoonLoader';
import { ReactComponent as GameTheme01 } from '../../img/theme#01.svg';
import { ReactComponent as GameTheme02 } from '../../img/theme#02.svg';
import { global } from "./data/PingPong.d"

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
			global.socket.connect();
			setSwitchContent(false);
			global.switchContent = false;
		}
		if (activeTheme === "theme1")
			global.socket.emit("joinTheme1");
		else if (activeTheme === "theme2")
			global.socket.emit("joinTheme2");
		global.theme = activeTheme;
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
		global.switchContent = true;
		setSwitchContent(true);
		global.socket.disconnect();
		// global.socket.emit("cancelRoom", {roomName: global.roomName, theme: global.theme});
	}

	useEffect(() => {
		window.onbeforeunload = () => { return "" };

		
		return () => {
			if (global.switchContent === false)
			{
				alert("You matching is about to be canceled");
				global.switchContent = true;
			}
			if (global.secondPlayerExist === false)
				global.socket.disconnect();
				// global.socket.emit("cancelRoom", {roomName: global.roomName, theme: global.theme});
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
	const	[switchContent, setSwitchContent] = useState(global.switchContent);
	const 	navigate = useNavigate();

	useEffectOnce(() => {
		global.socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
			global.roomName = room;
			global.playerId = playerId;
		});
		global.socket.off("secondPlayerJoined").on("secondPlayerJoined", () => {
			global.secondPlayerExist = true;
			global.switchContent = true;
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