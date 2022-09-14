
function Score( {s1, s2}: {s1: number, s2: number} ): JSX.Element {
	return (
		<div className="score-panel" >
			<div className="first-player">
				<div className="prof-picture">
					<img src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" />
				</div>
				<h3>Sesco</h3>
			</div>
			<div className="the-score">
				<div>{s1}</div>
				<div>-</div>
				<div>{s2}</div>
			</div>
			<div className="second-player">
				<div className="prof-picture">
					<img src="https://pbs.twimg.com/profile_images/1544851222464700416/iizecLE1_400x400.jpg" />
				</div>
				<h3>Senko</h3>
			</div>
		</div>
	);
}

export default Score;