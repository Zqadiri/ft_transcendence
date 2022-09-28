import axios from "axios";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { LeaderboardUser } from "../Interfaces/LeaderboardUser";
import "./leaderboard.css";
import LeaderboardPlayers from "./LeaderboardPlayers";

async function	getLeaderboardUsers(setLeaderboardUsers: Function)
{
	const	users = await axios.get("/users/all");

	users.data.sort((a: any, b: any) => {
		return b.xp === a.xp ? b.wins - a.wins : b.xp - a.xp;
	});

	setLeaderboardUsers([]);
	users.data.map((user: any, index: number) => {
		setLeaderboardUsers((current: LeaderboardUser[]) => [...current,
			{
				rank: index + 1,
				id: user.id,
				avatar: user.avatar,
				username: user.username,
				wins: user.wins,
				xp: user.xp,
				level: user.level
			}
		]);
	});
}

function	LeaderboardLoading(): JSX.Element
{
	return (
		<div className="bounce-loader">
			<BounceLoader color={'#205375'} speedMultiplier={1} size={45} />
		</div>
	);
}

function	Leaderboard(): JSX.Element
{
	const	[searchTerm, setSearchTerm] = useState("");
	const	[leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);

	useEffect(() => {
		getLeaderboardUsers(setLeaderboardUsers);
		const myTimer = setInterval(() => {
			getLeaderboardUsers(setLeaderboardUsers);
		}, 1000 * 30)

		return () => {
			clearInterval(myTimer);
		};
	}, []);

	function search(e: React.ChangeEvent<HTMLInputElement>)
	{
		setSearchTerm(e.target.value);
	}

	return (
		<section className="leaderboard">
			<table className="ld-content">
				<thead>
					<tr>
						<td className="ld-rank">Rank</td>
						<td className="ld-player">Player</td>
						<td className="ld-wins">Wins</td>
						<td className="ld-xp">XP Points</td>
						<td className="ld-level">Level</td>
					</tr>
				</thead>
				<header className="search-container">
					<input className="ld-search" placeholder="Search for a player here" id="lb-search" onChange={search}/>
				</header>
				{
					leaderboardUsers.length === 0 ?
						<LeaderboardLoading />
							: 
						<LeaderboardPlayers ldPlayers={leaderboardUsers} searchTerm={searchTerm} />
				}
			</table>
		</section>
	);
}

export default Leaderboard;