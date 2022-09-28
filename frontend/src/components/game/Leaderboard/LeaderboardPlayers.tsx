import { LeaderboardUser } from "../Interfaces/LeaderboardUser";

interface LeaderboardProps {
	ldPlayers: LeaderboardUser[],
	searchTerm: string
}

function	LeaderboardPlayers({ldPlayers, searchTerm}: LeaderboardProps): JSX.Element
{
	let		found: number = 0;

	return (
		<tbody>
			{
				ldPlayers.filter(player => 
						player.username.toLowerCase().includes(searchTerm.toLowerCase())
					).map((player) => {
						found += 1;
					return (
						<tr key={player.id}>
							<td className={`ld-rank rank${player.rank}`}><h3>{player.rank}</h3></td>
							<td className="ld-player">
								<div className="avatar"><img src={player.avatar} alt="avatar" /></div>
								<div className="username"><h3>{player.username}</h3></div>
							</td>
							<td className="ld-wins">{player.wins}</td>
							<td className="ld-xp">{player.xp}</td>
							<td className="ld-level">{player.level}</td>
						</tr>
					)
				})
			}
			{
				found === 0 &&
					<tr>
						<td>User Doesn't Exist!</td>
					</tr>
			}
		</tbody>
	);
}

export default LeaderboardPlayers;