import { useContext, useEffect, useState } from "react";
import { matchingContext } from "./Matching";
import { global } from "../PingPong/Data/PingPong.d"
import { MoonLoader } from "react-spinners";
import { selectionComponent } from "./Data/Matching.constants";
import { g_setIsMatching } from "../../NavAndChatWrapper";

function	Waiting(): JSX.Element
{
	let		{activeComponent, setActiveComponent} = useContext(matchingContext);
	const	[isCanceled, setIsCanceled] = useState(false);

	function	cancelRoom()
	{
		setIsCanceled(true);
		setActiveComponent(selectionComponent);
	}

	useEffect(() => {
		window.onbeforeunload = () => "";
		g_setIsMatching(true);

		return () => {
			console.log("canceled " + isCanceled);

			if (isCanceled === false && global.secondPlayerExist === false)
				alert("You matching is about to be canceled");
			else
				setActiveComponent(selectionComponent);

			activeComponent = selectionComponent;
			g_setIsMatching(false);

			if (global.secondPlayerExist === false)
				global.socket.disconnect();
			window.onbeforeunload = null;
		};
	}, []);

	return (
		<>
			<div className="waiting-container">
				<div className="spinner" >
					<MoonLoader color={'#F66B0E	'} speedMultiplier={0.4} size={25} />
				</div>
				<div className="cancel-button">
					<p>
						Waiting for the second player...
					</p>
					<button onClick={cancelRoom}>Cancel</button>
				</div>
			</div>
		</>
	);
}

export default Waiting;