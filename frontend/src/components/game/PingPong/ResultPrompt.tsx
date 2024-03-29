import { useContext, useEffect, useRef, useState } from "react";
import { playerOne, spectator } from "./Data/PingPong.contants";
import { global } from "./Data/PingPong.d"
import { gameContext } from "./PingPong";
import { resetGame } from "./Utils/tools";

function ResultPrompt(): JSX.Element {
	let		resultMessage: string;
	let		winnerName: string = "You";
	let		mainColor: string;
	const timeoutcodeRef = useRef(0);
	const {currentPlayersData, navigate} = useContext(gameContext);

	function goHomeComponent() {
		timeoutcodeRef.current = setTimeout(() => {
			navigate("/");
		}, 3000)
	}

	useEffect(() => {
		return () => {
			clearTimeout(timeoutcodeRef.current)
		}
	}, [])

	if (global.playerId === spectator)
	{
		winnerName = (global.winnerId === playerOne) ? currentPlayersData.firstPlayerName : currentPlayersData.secondPlayerName;
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