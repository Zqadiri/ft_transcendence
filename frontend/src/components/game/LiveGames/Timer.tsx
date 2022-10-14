import { useEffect, useState } from "react";

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

export default Timer;