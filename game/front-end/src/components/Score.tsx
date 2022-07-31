
function Score( {s1, s2}: {s1: number, s2: number} ): JSX.Element {
	return (
		<div>
			<h2>User1: {s1}</h2>
			<h2>User2: {s2}</h2>
		</div>
	);
}

export default Score;