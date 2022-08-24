import PingPong from "../pingPong/PingPong";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./Style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { SyntheticEvent, useState } from "react";

function	GameNavBar(): JSX.Element
{
	return (
			<nav className="game-nav">
				<Link to="/" style={{backgroundColor: "#F66B0E"}}>Play Game</Link>
				<Link to="/live" >Watch Game</Link>
			</nav>
	);
}

function	LiveGames(): JSX.Element
{
	return (
		<>
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