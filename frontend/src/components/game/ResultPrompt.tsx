import { useContext } from "react";
import { global } from "./data/PingPong.d"
import { gameContext } from "./PingPong";

export function resetGame() {
	global.player1X = 0;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player1Score = 0;

	global.player2X = global.canvasWidth - global.paddleWidth;
	global.player1Y = global.canvasHeight/2 - global.paddleHeight/2;
	global.player2Score = 0;

	global.ballX = global.canvasWidth/2;
	global.ballY = global.canvasHeight/2;

	global.gameStarted = false;
	global.roomName = "none"
	global.playerId = 0;
	global.winnerId = 0;
	global.secondPlayerExist = false;
}

function ResultPrompt(): JSX.Element {
	let		resultMessage: string;
	let		winnerName: string = "You";
	let		mainColor: string;

	const {currentPlayersData, setCurrentPlayersData} = useContext(gameContext);

	function goHomeComponent() {
		setTimeout(() => {
			resetGame();
			global.navigate?.("/");
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