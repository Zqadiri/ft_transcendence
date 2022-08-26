import PingPong from "../pingPong/PingPong";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./Style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { SyntheticEvent, useState } from "react";

const	GamesData = [
	{user1: "Sickl", user2: "Sesco", score1: 3, score2: 1, avatar1: "https://cdn.intra.42.fr/users/small_isaadi.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 1},
	{user1: "Zineb", user2: "Sara", score1: 6, score2: 8, avatar1: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", avatar2: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", id: 2},
	{user1: "Sara", user2: "Sickl", score1: 1, score2: 5, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_isaadi.jpg", id: 3},
	{user1: "Sesco", user2: "Zineb", score1: 5, score2: 4, avatar1: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", avatar2: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", id: 4},
	{user1: "Sara", user2: "Sesco", score1: 0, score2: 0, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 5},
];

function	LiveGames(): JSX.Element
{
	let imgsrc = "https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif";
	return (
		<>
			<ul className="live-games">
				{
					GamesData.map((current) => {
						return (
							<li>
								<div>
									<img src={current.avatar1} alt="user avatar"/>
									<h3>{current.user1}</h3>
								</div>
								<div className="scoreplusloader">
									<h3>{current.score1}</h3>
									<h3 style={{width: "100px"}}>
										<div className="animation-container">
											<div className="bar"></div>
										</div>
									</h3>	
									<h3>{current.score2}</h3>
								</div>
								<div>
									<img src={current.avatar2} alt="user avatar"/>
									<h3>{current.user2}</h3>
								</div>
							</li>
						);
					})
				}
			</ul>
		</>
	);
}

function	Matching(): JSX.Element
{
	const [activeTheme, setActiveTheme] = useState("none");
	return (
		<>
			<div className="matching-container" >
				<button
					onClick={() => {
						setActiveTheme(activeTheme === "theme1" ? "none" : "theme1");
					}}
					className={`${activeTheme === "theme1" ? "active-theme" : ""}`}
				>Theme #01</button>
				<button
					onClick={() => {
						setActiveTheme(activeTheme === "theme2" ? "none" : "theme2");
					}}
					className={`${activeTheme === "theme2" ? "active-theme" : ""}`}
				>Theme #02</button>
			</div>
			<div className="match-me">
				<button>Match Me</button>
			</div>
		</>
	);
}

function	Game(): JSX.Element
{
	return (
		<>
			<Tabs className="Tabs">
				<TabList>
					<Tab>Play Game</Tab>
					<Tab>Watch Game</Tab>
				</TabList>
				<TabPanel>
					<Matching />
				</TabPanel>
				<TabPanel>
					<LiveGames />
				</TabPanel>
			</Tabs>
		</>
	);
}

export default Game;