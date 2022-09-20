import { useEffectOnce } from "./GameTabs";
import { useNavigate } from 'react-router-dom';
import PropTypes, { InferProps } from "prop-types";
import { useState, useEffect } from "react";
import MoonLoader from 'react-spinners/MoonLoader';
import { ReactComponent as GameTheme01 } from '../../img/theme#01.svg';
import { ReactComponent as GameTheme02 } from '../../img/theme#02.svg';
import { global } from "./PingPong/Data/PingPong.d"

function GameRules(): JSX.Element {
	return (
		<section className="game-rules">
			<div className="rules-list">
				<h2>Game Rules:</h2>
				<ol>
					<li><span>(1)</span> To play choose your playground theme and click play.</li>
					<li><span>(2)</span> To win you need to score 10 balls against your opponent.</li>
					<li><span>(3)</span> You will play with your mouse.</li>
					<li><span>(4)</span> To move your paddle point the cursor inside the game canvas.</li>
					<li><span>(5)</span> While you play the speed of the ball increases.</li>
					<li><span>(6)</span> Second theme starting speed is higher than the first theme.</li>
				</ol>
			</div>
		</section>
	);
}

const getCookie = (name: string): string | null => {
	const nameLenPlus = (name.length + 1);
	return document.cookie
		.split(';')
		.map(c => c.trim())
		.filter(cookie => {
			return cookie.substring(0, nameLenPlus) === `${name}=`;
		})
		.map(cookie => {
			return decodeURIComponent(cookie.substring(nameLenPlus));
		})[0] || null;
}

function Selection({ setSwitchContent }: InferProps<typeof Selection.propTypes>): JSX.Element {
	const [activeTheme, setActiveTheme] = useState("none");

	const userID: any = getCookie("id");

	const joinRoom = ():void =>
	{
		if (activeTheme !== "none")
		{
			global.socket.connect();
			setSwitchContent(false);
			global.switchContent = false;
		}
		if (activeTheme === "theme01")
			global.socket.emit("joinTheme1", userID);
		else if (activeTheme === "theme02")
			global.socket.emit("joinTheme2", userID);
		global.theme = activeTheme;
	}

	return (
		<>
			<div className="matching-container" >
				<div
					onClick={() => {
						setActiveTheme(activeTheme === "theme01" ? "none" : "theme01");
					}}
					className={`${activeTheme === "theme01" ? "active-theme" : ""}`}
				>
					<GameTheme01 />
				</div>
				<div
					onClick={() => {
						setActiveTheme(activeTheme === "theme02" ? "none" : "theme02");
					}}
					className={`${activeTheme === "theme02" ? "active-theme" : ""}`}
				>
					<GameTheme02 />
				</div>
			</div>
			<div className={`${activeTheme !== "none" ? "play" : "play-disabled"}`}>
				<button onClick={joinRoom}>PLAY</button>
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
	const	[switchContent, setSwitchContent] = useState(true);
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