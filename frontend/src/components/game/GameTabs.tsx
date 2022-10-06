import "../../styles/game-styling.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef, useState } from "react";
import LiveGames from "./LiveGames/LiveGames";
import Leaderboard from "./Leaderboard/Leaderboard";
import { invitationWaiting, selectionComponent, waitingComponent } from "./Matching/Data/Matching.constants";
import Matching, { addMatchingSocketEventHandler } from "./Matching/Matching";
import { global } from "./PingPong/Data/PingPong.d";
import { cookies } from "../util";
import { chatSocket } from "../NavAndChatWrapper";

let					g_setTabIndex: Function;
let					g_setActiveComponent: Function;
let					defaultComponent: string = selectionComponent;
let					defaultTabIndex: number = 1;

export	function	useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	}, []);
}

export	function	resetDefaults()
{
	defaultComponent = selectionComponent;
	defaultTabIndex = 1;
}

export	function	handleGameInvitation(navigate: Function, opponentId: number)
{
	const		roomName: string = `Room:${cookies.get('id')}:${opponentId}`;

	navigate("/");
	g_setActiveComponent(invitationWaiting)
	g_setTabIndex(0);
	defaultComponent = invitationWaiting;
	defaultTabIndex = 0;

	global.socket.connect();

	addMatchingSocketEventHandler(navigate);
    global.theme = "theme01";
	global.socket.emit("joinInvitation", {roomName: roomName, userCounter: 1})

	chatSocket.emit('inviteToGame', {friendId: opponentId, roomName: roomName});
}

export	function	handleInvitationDeclined()
{
	alert("Your friend declined your invitation!");
	global.invitationDeclined = true;
	global.socket.disconnect();

	g_setActiveComponent(selectionComponent)
	g_setTabIndex(1);
}

function			GameTabs(): JSX.Element {
	const	[tabIndex, setTabIndex] = useState(defaultTabIndex);
	const	[activeComponent, setActiveComponent] = useState<string>(defaultComponent);

	useEffect(() => {
		g_setTabIndex = setTabIndex;
		g_setActiveComponent = setActiveComponent;
	}, []);

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
					<Matching activeComponent={activeComponent} setActiveComponent={setActiveComponent}/>
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