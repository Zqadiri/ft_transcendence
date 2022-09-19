import "../../styles/game-styling.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef } from "react";
import Matching from "./Matching"
import LiveGames from "./LivesGames";

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

// function	Game(): JSX.Element
// {
// 	return (
// 		<>
// 			<Router>
// 				<Routes>
// 					<Route path="/" element={<GameTabs />}></Route>
// 					<Route path="/play" element={<PingPong />}></Route>
// 				</Routes>
// 			</Router>
// 		</>
// 	);
// }

export default GameTabs;