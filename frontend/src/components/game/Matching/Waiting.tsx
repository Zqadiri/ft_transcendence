import { useContext, useEffect } from "react";
import { matchingContext } from "./Matching";
import { global } from "../PingPong/Data/PingPong.d"
import { MoonLoader } from "react-spinners";
import { selectionComponent, waitingComponent } from "./Data/Matching.constants";

function	Waiting(): JSX.Element
{
	let	{activeComponent, setActiveComponent} = useContext(matchingContext);

	function	cancelRoom()
	{
		setActiveComponent(selectionComponent);
		activeComponent = selectionComponent;
	}

	useEffect(() => {
		window.onbeforeunload = () => "";

		return () => {
			if (activeComponent === waitingComponent && global.secondPlayerExist === false)
				alert("You matching is about to be canceled");

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