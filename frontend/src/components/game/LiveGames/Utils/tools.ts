import axios, { AxiosResponse } from "axios";
import { GameData } from "../../Interfaces/GameData.interface";
import { LiveGame } from "../../Interfaces/LiveGame.interface";
import { global } from "../../PingPong/Data/PingPong.d";

export async	function	getGamesDataFromDatabase(setLiveGamesData: Function, setNoLiveGamesExist: Function)
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

export	function			handleNewScore(data: GameData, socketRoom: string, setLiveGamesData: Function)
{
	setLiveGamesData((current: LiveGame[]) => {
		let		newScore: boolean = false;

		current.map(game => {
			if (game.socketRoom === socketRoom && (game.score1 !== data.p1.score || game.score2 !== data.p2.score)) {
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

export	function			updateLiveGamesScore(liveGamesData: LiveGame[], setLiveGamesData: Function)
{
	let	socketRooms: string[] = liveGamesData.map((game) => game["socketRoom"]);

	global.socket.emit("joinSpecificRoom",  socketRooms);
	global.socket.off("newCoordinates").on("newCoordinates", (data: GameData, socketRoom) => handleNewScore(data, socketRoom, setLiveGamesData));
	
}

export	function 			updateAvailableGames(setAvailableGames: Function)
{
	global.socket.off("newGameIsAvailable").on("newGameIsAvailable", () => {
		setAvailableGames((current: number) => current + 1);
	});

	global.socket.off("gameEnded").on("gameEnded", () => {
		setAvailableGames((current: number) => current - 1);
	});
}