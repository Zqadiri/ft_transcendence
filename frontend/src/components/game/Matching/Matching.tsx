import { useEffectOnce } from "../GameTabs";
import { useNavigate } from 'react-router-dom';
import { useState, createContext } from "react";
import { global } from "../PingPong/Data/PingPong.d"
import Waiting from "./Waiting";
import Selection from "./Selection";
import { selectionComponent } from "./Data/Matching.constants";

export	const	matchingContext = createContext<any>({});

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


function	addMatchingSocketEventHandler(navigate: Function, setActiveComponent: Function)
{
	global.socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
		global.roomName = room;
		global.playerId = playerId;
	});

	global.socket.off("secondPlayerJoined").on("secondPlayerJoined", () => {
		global.secondPlayerExist = true;
		navigate("/play");
	});
}

function	Matching(): JSX.Element
{
	const	[activeComponent, setActiveComponent] = useState<string>(selectionComponent);
	const 	navigate = useNavigate();

	useEffectOnce(() => {
		addMatchingSocketEventHandler(navigate, setActiveComponent);
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