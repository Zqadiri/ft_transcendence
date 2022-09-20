import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game-styling.scss";
import { global } from "./PingPong/Data/PingPong.d";
import { Game } from "./Types&Interfaces/Game.type";
import { GameData } from "./Types&Interfaces/GameData.type";
import { LiveGame } from "./Types&Interfaces/LiveGame.type";


async	function	getGamesDataFromDatabase (setLiveGamesData: Function, setNoLiveGamesExist: Function)
{
	try {
		let		gameResp = await axios.get('/game/live');

		setLiveGamesData([]);
		gameResp.data.map(async (game: Game) => {
			let firstUserResponse = await axios.get("/users?id=" + game.firstPlayerID);
			let secondUserResponse = await axios.get("/users?id=" + game.secondPlayerID);

			setLiveGamesData((current: LiveGame[]) => [...current,
				{
					user1: firstUserResponse.data.username,
					user2: secondUserResponse.data.username,
					score1: game.firstPlayerScore,
					score2: game.secondPlayerScore,
					avatar1: firstUserResponse.data.avatar,
					avatar2: secondUserResponse.data.avatar,
					socketRoom: game.socketRoom,
					theme: game.theme,
					id: game.id,
					createdAt: game.createdAt
				}
			]);
			setNoLiveGamesExist(false);
		});

	} catch(e) {
		setNoLiveGamesExist(true);
	}
}

function			handleNewCoordinates(data: GameData, socketRoom: string, setLiveGamesData: Function)
{
	setLiveGamesData((current: LiveGame[]) => {
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

function			updateLiveGamesScore(liveGamesData: LiveGame[], setLiveGamesData: Function)
{
	let	socketRooms: string[] = liveGamesData.map((game) => game["socketRoom"]);

	global.socket.emit("joinSpecificRoom",  socketRooms);
	global.socket.off("newCoordinates").on("newCoordinates", (data: GameData, socketRoom) => handleNewCoordinates(data, socketRoom, setLiveGamesData));
	
}

function 			updateAvailableGames(setAvailableGames: Function)
{
	global.socket.off("newGameIsAvailable").on("newGameIsAvailable", () => {
		setAvailableGames((current: number) => current + 1);
	});

	global.socket.off("gameEnded").on("gameEnded", () => {
		setAvailableGames((current: number) => current - 1);
	});
}

function			setDataToJoinLiveGame(socketRoom: string, gameTheme: string)
{
	global.roomName = socketRoom;
	global.playerId = 3;
	global.theme = gameTheme;
	global.secondPlayerExist = true;
	global.socket.disconnect().connect();
}

function			NoGamesFound(): JSX.Element
{
	return (
		<section className="no-live-games flex-center-column">
			<h1>No Live Games Are Available Right Now!</h1>
		</section>
	);
}

function			Timer( {gameCreatedAt}: {gameCreatedAt: Date} ): JSX.Element
{
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);


	function getTime()
	{
		const time = Date.now() - Date.parse(String(gameCreatedAt));
		setMinutes(Math.floor((time / 1000 / 60) % 60));
		setSeconds(Math.floor((time / 1000) % 60));	
	}

	useEffect(() => {
		const interval = setInterval(() => getTime(), 1000);
	
		return () => clearInterval(interval);
	  }, []);

	return (
		<div className="timer">
			<span>{minutes}:{seconds < 10 ? '0' + seconds: seconds}</span>
		</div>
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

		getGamesDataFromDatabase(setLiveGamesData, setNoLiveGamesExist);

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
								<img src={current.avatar1} alt="user avatar"/>
								<h3>{current.user1}</h3>
							</div>
							<div className="scoreplusloader">
								<h3>{current.score1}</h3>
								<h3 style={{width: "100px"}}>
									<Timer gameCreatedAt={current.createdAt} />
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
	);
}

export default LiveGames;