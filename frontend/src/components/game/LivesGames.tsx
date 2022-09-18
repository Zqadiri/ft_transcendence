import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import "../../styles/game-styling.css";

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



// const	liveGamesData = [
// 	{user1: "Sickl", user2: "Sesco", score1: 3, score2: 1, avatar1: "https://cdn.intra.42.fr/users/small_isaadi.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 1},
// 	{user1: "Zineb", user2: "Sara", score1: 6, score2: 8, avatar1: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", avatar2: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", id: 2},
// 	{user1: "Sara", user2: "Sickl", score1: 1, score2: 5, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_isaadi.jpg", id: 3},
// 	{user1: "Sesco", user2: "Zineb", score1: 5, score2: 4, avatar1: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", avatar2: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", id: 4},
// 	{user1: "Sara", user2: "Sesco", score1: 0, score2: 0, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 5},
// ];	


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
		id: number
	}[]>([]);

	useEffect(() => {

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
						id: game.id
						}
					]);
				})
				.catch(e => console.log("sesco error: " + e));

				axios.get("/users?id=" + game.secondPlayerID)
				.then(userResp => {
					setLiveGamesData(current => {
						let ret = JSON.parse(JSON.stringify(current));
						console.log({ret9able: JSON.parse(JSON.stringify(ret))});
						ret[ret.length - 1].user2 = userResp.data.username;
						ret[ret.length - 1].avatar2 = userResp.data.avatar;
						// current[current.length - 1].user2 = userResp.data.username;
						// current[current.length - 1].avatar2 = userResp.data.avatar;
						console.log({retba3da: JSON.parse(JSON.stringify(ret))});
						return ret;
					});
				})
				.catch(e => console.log("sesco error: " + e));
			});
	
		})
		.catch(e => {
			console.log("sesco error: " + e);
		});

	}, []);

	// let		namedRoom: string;

	// const joinLiveGame = (): void =>
	// {
	// 	socket.emit("joinLiveGame", namedRoom);
	// }
	// socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
	//		global.roomName = room;
	//		global.playerId = playerId;
	//		global.theme = "theme1";
	// });
	return (
		<>
			<ul className="live-games">
				{
					liveGamesData.map((current) => {
						return (
							<li className="flex-jc-sb flex-ai-cr" key={current.id}>
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