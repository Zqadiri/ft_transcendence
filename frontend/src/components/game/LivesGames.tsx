import axios, { AxiosResponse, AxiosStatic } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game-styling.scss";
import { global } from "./PingPong/Data/PingPong.d";
import { Game } from "./Interfaces/Game.interface";
import { GameData } from "./Interfaces/GameData.interface";
import { LiveGame } from "./Interfaces/LiveGame.interface";


async	function	getGamesDataFromDatabase (setLiveGamesData: Function, setNoLiveGamesExist: Function)
{
	try {
		let		gameResp = await axios.get('/game/live');
		let		gamesFirstPlayer: AxiosResponse<any, any>[] = [];
		let		gamesSecondPlayer: AxiosResponse<any, any>[] = [];


		for (let i = 0; i < gameResp.data.length; i++)
		{
			const firstResp = await axios.get("/users?id=" + gameResp.data[i].firstPlayerID);
			gamesFirstPlayer.push(firstResp);

			const secondResp = await axios.get("/users?id=" + gameResp.data[i].secondPlayerID);
			gamesSecondPlayer.push(secondResp);
		}
		// gameResp.data.map(async (game: Game) => {
		// });

		if (gameResp.data)
		{
			setLiveGamesData([]);
			for (let i = 0; i < gameResp.data.length; i++)
			{
				setLiveGamesData((current: LiveGame[]) => [...current,
					{
						user1: gamesFirstPlayer[i].data.username,
						user2: gamesSecondPlayer[i].data.username,
						score1: gameResp.data[i].firstPlayerScore,
						score2: gameResp.data[i].secondPlayerScore,
						avatar1: gamesFirstPlayer[i].data.avatar,
						avatar2: gamesSecondPlayer[i].data.avatar,
						socketRoom: gameResp.data[i].socketRoom,
						theme: gameResp.data[i].theme,
						id: gameResp.data[i].id,
						createdAt: gameResp.data[i].createdAt
					}
				]);
			}	
			setNoLiveGamesExist(false);
		}

	} catch(e) {
		setNoLiveGamesExist(true);
	}
}

function			handleNewScore(data: GameData, socketRoom: string, setLiveGamesData: Function)
{
	setLiveGamesData((current: LiveGame[]) => {
		let		newScore: boolean = false;

		current.map(game => {
			if (game.socketRoom === socketRoom && game.score1 !== data.p1.score || game.score2 !== data.p2.score) {
				game.score1 = data.p1.score;
				game.score2 = data.p2.score;
				newScore = true;
			}

			return game;
		});
		if (newScore) return Array.from(current);

		return current;
	});
}

function			updateLiveGamesScore(liveGamesData: LiveGame[], setLiveGamesData: Function)
{
	let	socketRooms: string[] = liveGamesData.map((game) => game["socketRoom"]);

	global.socket.emit("joinSpecificRoom",  socketRooms);
	global.socket.off("newCoordinates").on("newCoordinates", (data: GameData, socketRoom) => handleNewScore(data, socketRoom, setLiveGamesData));
	
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
		getTime();
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

	console.log(`available games: ${availableGames}`);
	if (availableGames == 0 || noLiveGamesExist) return <NoGamesFound />
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
									{/* <div className="animation-container">
										<div className="bar"></div>
									</div> */}
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