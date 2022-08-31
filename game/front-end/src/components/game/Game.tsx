import PingPong from "../pingPong/PingPong";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./Style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { SyntheticEvent, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const	socket = io("http://localhost:3001/game");
export let		roomName: string = "none";

const	GamesData = [
	{user1: "Sickl", user2: "Sesco", score1: 3, score2: 1, avatar1: "https://cdn.intra.42.fr/users/small_isaadi.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 1},
	{user1: "Zineb", user2: "Sara", score1: 6, score2: 8, avatar1: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", avatar2: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", id: 2},
	{user1: "Sara", user2: "Sickl", score1: 1, score2: 5, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_isaadi.jpg", id: 3},
	{user1: "Sesco", user2: "Zineb", score1: 5, score2: 4, avatar1: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", avatar2: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", id: 4},
	{user1: "Sara", user2: "Sesco", score1: 0, score2: 0, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 5},
];	

function useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	});
}

function	LiveGames(): JSX.Element
{
	return (
		<>
			<ul className="live-games">
				{
					GamesData.map((current) => {
						return (
							<li key={current.id}>
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
	const joinRoom = ():void =>
	{
		if (activeTheme === "theme1")
			socket.emit("joinTheme1");
		else if (activeTheme === "theme2")
			socket.emit("joinTheme2");
	}
	useEffectOnce(() => {
		socket.on("joinedRoom", (data) => {
			roomName = data;
		});
	});
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
			<div className="matching">

			</div>
			<div className="match-me">
				<button onClick={joinRoom}>Match Me</button>
			</div>
		</>
	);
}

function	Game(): JSX.Element
{
	return (
		<>
			{/* <PingPong /> */}
			<Tabs className="Tabs">
				<TabList>
					<Tab>Play a Game</Tab>
					<Tab>Live Games</Tab>
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