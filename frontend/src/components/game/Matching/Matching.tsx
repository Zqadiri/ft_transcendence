import { useNavigate } from 'react-router-dom';
import { useState, createContext } from "react";
import { global } from "../PingPong/Data/PingPong.d"
import Waiting from "./Waiting";
import Selection from "./Selection";
import { selectionComponent } from "./Data/Matching.constants";
import { defaultComponent, useEffectOnce } from '../GameTabs';
import { cookies } from "../../util";
import { statusSocket } from '../../..';

export	const	matchingContext = createContext<any>({});

function GameRules(): JSX.Element {
	return (
		<section className="game-rules">
			<div className="rules-list">
				<h2>Game Rules:</h2>
				<ol>
					<li><span>(1)</span><p>To play choose your playground theme and click play.</p></li>
					<li><span>(2)</span><p>To win you need to score 10 balls against your opponent.</p></li>
					<li><span>(3)</span><p>You will play with your mouse.</p></li>
					<li><span>(4)</span><p>To move your paddle point the cursor inside the game canvas.</p></li>
					<li><span>(5)</span><p>While you play the speed of the ball increases.</p></li>
					<li><span>(6)</span><p>Second theme starting speed is higher than the first theme.</p></li>
				</ol>
			</div>
		</section>
	);
}


function	addMatchingSocketEventHandler(navigate: Function)
{
	global.socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
		global.roomName = room;
		global.playerId = playerId;
	});

	global.socket.off("secondPlayerJoined").on("secondPlayerJoined", () => {
		global.secondPlayerExist = true;
		statusSocket.emit('inGame', {userId: cookies.get('id'), status: "ingame"});
		navigate("/play");
	});
}

function	Matching(): JSX.Element
{
	const	[activeComponent, setActiveComponent] = useState<string>(defaultComponent);
	const 	navigate = useNavigate();

	useEffectOnce(() => {
		addMatchingSocketEventHandler(navigate);
	});

	return (
		<>
			<matchingContext.Provider value={{activeComponent, setActiveComponent}}>
				{activeComponent === selectionComponent ? <Selection /> : <Waiting />}
				<GameRules />
			</matchingContext.Provider>
		</>
	);
}

export default Matching;