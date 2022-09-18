import axios from "axios";
import { func } from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game-styling.scss";
import { GameData, AllGames, global, Game } from "./data/PingPong.d";


async	function	getGamesDataFromDatabase (setLiveGamesData: React.Dispatch<React.SetStateAction<AllGames[]>>, setNoLiveGamesExist: React.Dispatch<React.SetStateAction<boolean>>) {

	try {
		let gameResp = await axios.get('/game/live');

		setLiveGamesData([]);

		gameResp.data.map(async (game: Game) => {
			let firstUserResponse = await axios.get("/users?id=" + game.firstPlayerID);
			let secondUserResponse = await axios.get("/users?id=" + game.secondPlayerID);

			setLiveGamesData(current => [...current,
				{
					user1: firstUserResponse.data.username,
					user2: secondUserResponse.data.username,
					score1: game.firstPlayerScore,
					score2: game.secondPlayerScore,
					avatar1: firstUserResponse.data.avatar,
					avatar2: secondUserResponse.data.avatar,
					socketRoom: game.socketRoom,
					theme: game.theme,
					id: game.id
				}
			]);

			setNoLiveGamesExist(false);
		});

	} catch(e) {

		setNoLiveGamesExist(true);
	}
}

function			handleNewCoordinates(data: GameData, socketRoom: string, setLiveGamesData: React.Dispatch<React.SetStateAction<AllGames[]>>) {

	setLiveGamesData(current => {
		current.map(game => {

			if (game.socketRoom === socketRoom) {
				game.score1 = data.p1.score;
				game.score2 = data.p2.score;
			}

			return game;
		});
		const	newState = Array.from(current);
	
		return newState;
	});
}

function			updateLiveGamesScore(liveGamesData: AllGames[], setLiveGamesData: React.Dispatch<React.SetStateAction<AllGames[]>>) {

	let	socketRooms: string[] = liveGamesData.map((game) => game["socketRoom"]);

	global.socket.emit("joinSpecificRoom",  socketRooms);
	global.socket.off("newCoordinates").on("newCoordinates", (data: GameData, socketRoom) => handleNewCoordinates(data, socketRoom, setLiveGamesData));
	
}

function 			updateAvailableGames (setAvailableGames: React.Dispatch<React.SetStateAction<number>>) {

	global.socket.off("newGameIsAvailable").on("newGameIsAvailable", () => {
		setAvailableGames(current => current + 1);
	});

	global.socket.off("gameEnded").on("gameEnded", () => {
		setAvailableGames(current => current - 1);
	});
}

function			setNeccessaryDataToJoinLiveGame(socketRoom: string, gameTheme: string) {
	global.roomName = socketRoom;
	global.playerId = 3;
	global.theme = gameTheme;
	global.secondPlayerExist = true;
	global.socket.disconnect();
	global.socket.connect();
}

function			NoGamesFound(): JSX.Element {

	return (
		<>
			<section className="no-live-games flex-center-column">
				<h1>No Live Games Are Available Right Now!</h1>
			</section>
		</>
	);
}

export function		LiveGames(): JSX.Element
{
	const	[liveGamesData, setLiveGamesData] = useState<AllGames[]>([]);
	const	[noLiveGamesExist, setNoLiveGamesExist] = useState(true);
	const	[AvailableGames, setAvailableGames] = useState<number>(0);
	const 	navigate = useNavigate();

	useEffect(() => {
		global.socket.connect();

		getGamesDataFromDatabase(setLiveGamesData, setNoLiveGamesExist);

		return () => {
			if (global.secondPlayerExist === false)
				global.socket.disconnect();
		};
	}, [AvailableGames]);

	updateLiveGamesScore(liveGamesData, setLiveGamesData);
	updateAvailableGames(setAvailableGames);

	const joinLiveGame = (socketRoom: string, gameTheme: string) => {

		setNeccessaryDataToJoinLiveGame(socketRoom, gameTheme);
		global.socket.emit("joinSpecificRoom",  socketRoom);

		navigate("/play");
	}

	if (noLiveGamesExist) return <NoGamesFound />

	return (
		<>
			<ul className="live-games">
				{
					liveGamesData.map((current) => {
						return (
							<li className="flex-jc-sb flex-ai-cr" key={current.id} onClick={() => joinLiveGame(current.socketRoom, current.theme)}>
								<div>
									<img src={current.avatar1} alt="user avatar"/>
									<h3>{current.user1}</h3>
								</div>
								<div className="scoreplusloader">
									<h3>{current.score1}</h3>
									<h3 style={{width: "100px"}}>
										<div className="animation-container">
											<div className="bar"></div>
										</div>
									</h3>	
									<h3>{current.score2}</h3>
								</div>
								<div>
									<img src={current.avatar2} alt="user avatar"/>
									<h3>{current.user2}</h3>
								</div>
							</li>
						);
					})
				}
			</ul>
		</>
	);
}

export default LiveGames;