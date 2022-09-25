import { useContext, useState } from "react";
import { matchingContext } from "./Matching";
import { global } from "../PingPong/Data/PingPong.d"
import { ReactComponent as GameTheme01 } from '../../../img/theme1.svg';
import { ReactComponent as GameTheme02 } from '../../../img/theme2.svg';
import { waitingComponent } from "./Data/Matching.constants";
import { cookies } from "../../util";


function	Selection(): JSX.Element {
	const [activeTheme, setActiveTheme] = useState("none");
	const {setActiveComponent} = useContext(matchingContext);

	function	joinRoom()
	{
		if (activeTheme === "theme01" || activeTheme === "theme02")
		{
			const	currentUserId = cookies.get("id");
			global.socket.connect();

			if (activeTheme === "theme01")
				global.socket.emit("joinTheme1", currentUserId);
			else if (activeTheme === "theme02")
				global.socket.emit("joinTheme2", currentUserId);

			setActiveComponent(waitingComponent);
		}
		global.theme = activeTheme;
	}

	function	handleOnClick(theme: string)
	{
		if (activeTheme === theme) setActiveTheme("none");
		else setActiveTheme(theme);
	}

	function	handleClassName(theme: string): string
	{
		if (activeTheme === theme) return "active-theme";
		return "";
	}

	function	handlePlayButton(): string
	{
		if (activeTheme === "none") return "play-disabled";
		return "play";
	}

	return (
		<>
			<section className="matching-container" >
				<div onClick={() => handleOnClick("theme01")} className={handleClassName("theme01")}>
					<GameTheme01 />
				</div>
				<div onClick={() => handleOnClick("theme02")} className={handleClassName("theme02")}>
					<GameTheme02 />
				</div>
			</section>
			<section className={handlePlayButton()}>
				<button onClick={joinRoom} title="choose a theme to play with">PLAY</button>
			</section>
		</>
	);
}

export default Selection;