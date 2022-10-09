import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/game-styling.scss";
import { global } from "../PingPong/Data/PingPong.d";
import { LiveGame } from "../Interfaces/LiveGame.interface";
import { getGamesDataFromDatabase, setDataToJoinLiveGame, updateAvailableGames, updateLiveGamesScore } from "./Utils/tools";
import Timer from "./Timer";

function			NoGamesFound(): JSX.Element
{
	return (
		<section className="no-live-games flex-center-column">
			<h1>No Live Games Are Available Right Now!</h1>
		</section>
	);
}

export function		LiveGames(): JSX.Element
{
	const	[liveGamesData, setLiveGamesData] = useState<LiveGame[]>([]);
	const	[noLiveGamesExist, setNoLiveGamesExist] = useState(true);
	const	[availableGames, setAvailableGames] = useState<number>(0);
	const 	navigate = useNavigate();

	function joinLiveGame(socketRoom: string, gameTheme: string) {
		setDataToJoinLiveGame(socketRoom, gameTheme);
		global.socket.emit("joinSpecificRoom",  socketRoom);

		navigate("/play");
	}

	useEffect(() => {
		global.socket.connect();

		getGamesDataFromDatabase(setLiveGamesData, setNoLiveGamesExist, setAvailableGames);

		return () => {
			if (global.secondPlayerExist === false)
				global.socket.disconnect();
		};
	}, [availableGames]);

	updateLiveGamesScore(liveGamesData, setLiveGamesData);
	updateAvailableGames(setAvailableGames);

	if (noLiveGamesExist) return <NoGamesFound />
	return (
		<ul className="live-games">
			{
				liveGamesData.map((current) => {
					return (
						<li className="flex-jc-sb flex-ai-cr" key={current.id} onClick={() => joinLiveGame(current.socketRoom, current.theme)}>
							<div>
								<div className="img" style={{
									backgroundImage: `url(${current.avatar1})`,
									backgroundColor: "white",
									backgroundPosition: "center",
									backgroundSize: "cover",
									backgroundRepeat: "none",
								}}></div>
								<h3>{current.user1}</h3>
							</div>
							<div className="live-score-panel">
								<h3>{current.score1}</h3>
								<Timer gameCreatedAt={current.createdAt} />
								<h3>{current.score2}</h3>
							</div>
							<div>
								<div className="img" style={{
									backgroundImage: `url(${current.avatar2})`,
									backgroundColor: "white",
									backgroundPosition: "center",
									backgroundSize: "cover",
									backgroundRepeat: "none",
								}}></div>
								<h3>{current.user2}</h3>
							</div>
						</li>
					);
				})
			}
		</ul>
	);
}

export default LiveGames;