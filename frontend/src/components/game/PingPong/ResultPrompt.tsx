import { useContext } from "react";
import { global } from "./Data/PingPong.d"
import { gameContext } from "./PingPong";
import { resetGame } from "./Utils/tools";

function ResultPrompt(): JSX.Element {
	let		resultMessage: string;
	let		winnerName: string = "You";
	let		mainColor: string;

	const {currentPlayersData, navigate} = useContext(gameContext);

	function goHomeComponent() {
		setTimeout(() => {
			resetGame();
			navigate("/");
		}, 3000)
	}

	if (global.playerId > 2)
	{
		winnerName = (global.winnerId === 1) ? currentPlayersData.firstPlayerName : currentPlayersData.secondPlayerName;
		resultMessage = "Won The Game";
		mainColor = "#f66b0e";
	}
	else if (global.playerId === global.winnerId)
	{
		resultMessage = "Won The Game";
		mainColor = "#6a994e";
	}
	else 
	{
		resultMessage = "Lost The Game";
		mainColor = "#d62828";
	}

	return (
		<>
			<section className="result-overlay">
				<div className="prompt">
					<span style={{color: mainColor}}>{winnerName}</span>
					<span style={{backgroundColor: mainColor}}>{resultMessage}</span>
				</div>
			</section>
			{goHomeComponent()}
		</>
	);
}

export default ResultPrompt;