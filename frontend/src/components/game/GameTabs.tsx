import "../../styles/game-styling.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef } from "react";
import Matching from "./Matching/Matching"
import LiveGames from "./LiveGames/LiveGames";

export function useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	}, []);
}

export function	GameTabs(): JSX.Element
{
	return (
		<>
			<Tabs className="Tabs">
				<TabList>
					<Tab>Play a Game</Tab>
					<Tab>Live Games</Tab>
				</TabList>
				<TabPanel>
					<Matching />
				</TabPanel>
				<TabPanel>
					<LiveGames />
				</TabPanel>
			</Tabs>
		</>
	);
}

export default GameTabs;