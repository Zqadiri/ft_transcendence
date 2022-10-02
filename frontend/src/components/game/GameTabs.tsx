import "../../styles/game-styling.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef, useState } from "react";
import Matching from "./Matching/Matching"
import LiveGames from "./LiveGames/LiveGames";
import Leaderboard from "./Leaderboard/Leaderboard";


export function useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	}, []);
}

function GameTabs(): JSX.Element {
	const [tabIndex, setTabIndex] = useState(1);

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