import { useContext } from "react";
import { gameContext } from "./PingPong";

function	Score( {s1, s2}: {s1: number, s2: number} ): JSX.Element
{	
	const {currentPlayersData, setCurrentPlayersData} = useContext(gameContext);

	return (
		<div className="score-panel flex-gap20 flex-jc-se flex-ai-cr" >
			<div className="first-player">
				<div className="prof-picture">
					<img src={currentPlayersData.firstPlayerAvatar} alt="avatar1" />
				</div>
				<h3>{currentPlayersData.firstPlayerName}</h3>
			</div>
			<div className="the-score flex-jc-sb flex-ai-cr ">
				<div>{s1}</div>
				<div>-</div>
				<div>{s2}</div>
			</div>
			<div className="second-player">
				<div className="prof-picture">
					<img src={currentPlayersData.secondPlayerAvatar} alt="avatar2"/>
				</div>
				<h3>{currentPlayersData.secondPlayerName}</h3>
			</div>
		</div>
	);
}

export default Score;