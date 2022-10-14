import { useContext } from "react";
import { gameContext } from "./PingPong";

function	Score( {s1, s2}: {s1: number, s2: number} ): JSX.Element
{	
	const {currentPlayersData} = useContext(gameContext);

	return (
		<div className="score-panel flex-gap20 flex-jc-se flex-ai-cr" >
			<div className="first-player">
				<div className="prof-picture" style={{
					backgroundImage: `url(${currentPlayersData.firstPlayerAvatar})`,
					backgroundColor: "transparent",
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundRepeat: "none",
				}}></div>
				<h3>{currentPlayersData.firstPlayerName}</h3>
			</div>
			<div className="the-score flex-jc-sb flex-ai-cr ">
				<div>{s1}</div>
				<div>-</div>
				<div>{s2}</div>
			</div>
			<div className="second-player">
				<div className="prof-picture" style={{
					backgroundImage: `url(${currentPlayersData.secondPlayerAvatar})`,
					backgroundColor: "transparent",
					backgroundPosition: "center",
					backgroundSize: "cover",
					backgroundRepeat: "none",
				}}></div>
				<h3>{currentPlayersData.secondPlayerName}</h3>
			</div>
		</div>
	);
}

export default Score;