import "../../styles/game-styling.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef, useState } from "react";
import LiveGames from "./LiveGames/LiveGames";
import Leaderboard from "./Leaderboard/Leaderboard";
import { selectionComponent, waitingComponent } from "./Matching/Data/Matching.constants";
import Matching, { addMatchingSocketEventHandler } from "./Matching/Matching";
import { global } from "./PingPong/Data/PingPong.d";
import { cookies } from "../util";
import { chatSocket } from "../NavAndChatWrapper";

let					defaultTabIndex: number = 1;
export	let			defaultComponent: string = selectionComponent;

export	function	useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	}, []);
}

export	function	handleGameInvitation(navigate: Function, opponentId: number)
{
	const		roomName: string = `Room:${cookies.get('id')}:${opponentId}`;

	defaultTabIndex = 0;
	defaultComponent = waitingComponent;

	// global.roomName = roomName;
    // global.playerId = 1;
    global.theme = "theme01";

	global.socket.connect();
	addMatchingSocketEventHandler(navigate);
	global.socket.emit("joinInvitation", {roomName: roomName, userCounter: 1})
	navigate("/play");
	chatSocket.emit('inviteToGame', {friendId: opponentId, roomName: roomName});

	// send an event in chat namespace
	// handle it globally with a prompt
	// wherever you are go to home
	// chose play a game tab
	// join theme01 with a special room name
	// and show waiting component
	// if the invited player didn't accept the invite or it disconnects, cancel the whole invitation
}

export	function	handleInvitationDeclined(navigate: Function)
{
	global.socket.disconnect();

	defaultTabIndex = 1;
	defaultComponent = selectionComponent;

	navigate("/play");
}

function			GameTabs(): JSX.Element {
	const	[tabIndex, setTabIndex] = useState(defaultTabIndex);

	return (
		<>
			<Tabs
				selectedIndex={tabIndex} onSelect={tabIndex => setTabIndex(tabIndex)}
				aria-label="Tabs"
			>
				<TabList>
					<Tab>Play a Game</Tab>
					<Tab>Leaderboard</Tab>
					<Tab>Live Games</Tab>
				</TabList>
				<TabPanel>
					<Matching />
				</TabPanel>
				<TabPanel>
					<Leaderboard />
				</TabPanel>
				<TabPanel>
					<LiveGames />
				</TabPanel>
			</Tabs>
		</>
	);
}

export default GameTabs;