import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import "../../styles/game-styling.scss";
import { GameData, global } from "./data/PingPong.d";

interface Game {
	id: number,
	socketRoom: string,
	isPlaying:boolean,
	firstPlayerID: string,
	secondPlayerID: string,
	firstPlayerScore: number,
	secondPlayerScore: number,
	theme: string,
	createdAt: Date,
	modifiedAt: Date,
	finishedAt: Date,
}

export function	LiveGames(): JSX.Element
{

	const	[liveGamesData, setLiveGamesData] = useState<{
		user1: string,
		user2: string,
		score1: number,
		score2: number,
		avatar1: string,
		avatar2: string,
		socketRoom: string,
		theme: string,
		id: number
	}[]>([]);
	const	[noLiveGames, setNoLiveGames] = useState(true);
	const	[GamesAvailable, setGamesAvailable] = useState<number>(0);
	const 	navigate = useNavigate();

	const update_score = () => {
		let	roomArray: string[] = liveGamesData.map((game) => game["socketRoom"]);
		global.socket.emit("joinSpecificRoom",  roomArray);

		global.socket.off("newCoordinates").on("newCoordinates", (data: GameData, socketRoom) => {
			liveGamesData.map(game => {
				if (game.socketRoom === socketRoom)
				{
					setLiveGamesData(current => {
						let ret = JSON.parse(JSON.stringify(current));
						ret[ret.length - 1].score1 = data.p1.score;
						ret[ret.length - 1].score2 = data.p2.score;
						return ret;
					});
				}
			});
		});
		
		global.socket.off("newGameIsAvailable").on("newGameIsAvailable", () => {
			setLiveGamesData([]);
			setGamesAvailable(current => current + 1);
		});

		global.socket.off("gameEnded").on("gameEnded", () => {
			setLiveGamesData([]);
			setGamesAvailable(current => current - 1);
		});
	}

	useEffect(() => {

		global.socket.connect();

		console.log("i've been called");
		axios.get('/game/live')
		.then((gameResp: AxiosResponse) => {
	
			gameResp.data.map((game: Game) => {
				axios.get("/users?id=" + game.firstPlayerID)
				.then(userResp => {
					setLiveGamesData(current => [...current,
						{
						user1: userResp.data.username,
						user2: "",
						score1: game.firstPlayerScore,
						score2: game.secondPlayerScore,
						avatar1: userResp.data.avatar,
						avatar2: "",
						socketRoom: game.socketRoom,
						theme: game.theme,
						id: game.id
						}
					]);
				})
				.catch(e => console.log("sesco error: " + e));

				axios.get("/users?id=" + game.secondPlayerID)
				.then(userResp => {
					setLiveGamesData(current => {
						let ret = JSON.parse(JSON.stringify(current));
						ret[ret.length - 1].user2 = userResp.data.username;
						ret[ret.length - 1].avatar2 = userResp.data.avatar;
						return ret;
					});
				})
				.catch(e => console.log("sesco error: " + e));
			});
			setNoLiveGames(false);
		})
		.catch(() => {
			setNoLiveGames(true);
		});

		return () => {
			if (global.secondPlayerExist === false)
				global.socket.disconnect();
		};

	}, [GamesAvailable]);

	update_score();

	const watchTheGame = (socketRoom: string, gameTheme: string) => {
			global.roomName = socketRoom;
			global.playerId = 3;
			global.theme = gameTheme;
			global.secondPlayerExist = true;
			navigate("/play");
	}

	if (noLiveGames)
	{
		return (
			<>
				<section className="no-live-games flex-center-column">
					<h1>No Live Games Are Available Right Now!</h1>
				</section>
			</>
		);
	}
	return (
		<>
			<ul className="live-games">
				{
					liveGamesData.map((current) => {
						return (
							<li className="flex-jc-sb flex-ai-cr" key={current.id} onClick={() => watchTheGame(current.socketRoom, current.theme)}>
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