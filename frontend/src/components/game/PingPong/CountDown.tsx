import { useState } from "react";
import { global } from "../data/PingPong.d"

function CountDown(): JSX.Element {
	
	const [countdownDisappear, setCountdownDisappear] = useState(false);

	global.setCountdownDisappear = setCountdownDisappear;
	return (
		<section className={`${countdownDisappear ? "count-down-disabled" : "count-down"}`}>
			 <div className="number">
				<h2>3</h2>
			</div>
			 <div className="number">
				<h2>2</h2>
			</div>
			 <div className="number">
				<h2>1</h2>
			</div>
		</section>
	);
}

export default CountDown;