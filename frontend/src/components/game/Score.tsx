import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useEffectOnce } from "./Game";

function Score
(
	{s1, s2, playersID}:
	{s1: number, s2: number, playersID: {firstPlayerId: number, secondPlayerId: number}} ): JSX.Element
{	
	const	[playerData, setPlayerData] = useState<{avatar: string, username: string}[]>([
		{
			avatar: "",
			username: "loading"
		},
		{
			avatar: "",
			username: "loading"
		}
	]);

	useEffect(() => {
		axios.get("/users?id=" + playersID.firstPlayerId).then(resp => {
			setPlayerData(x => [{avatar: resp.data.avatar, username: resp.data.username}, x[1]]);
		}).catch(e => {
			console.log("sesco error: " + e);
		});

		axios.get("/users?id=" + playersID.secondPlayerId).then(resp => {
			setPlayerData(x => [x[0], {avatar: resp.data.avatar, username: resp.data.username}]);
		}).catch(e => {
			console.log("sesco error: " + e);
		});
	}, [playersID]);

	return (
		<div className="score-panel" >
			<div className="first-player">
				<div className="prof-picture">
					<img src={playerData[0].avatar} alt={playerData[0].username} />
				</div>
				<h3>{playerData[0].username}</h3>
			</div>
			<div className="the-score">
				<div>{s1}</div>
				<div>-</div>
				<div>{s2}</div>
			</div>
			<div className="second-player">
				<div className="prof-picture">
					<img src={playerData[1].avatar} alt={playerData[1].username}/>
				</div>
				<h3>{playerData[1].username}</h3>
			</div>
		</div>
	);
}

export default Score;