import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "../styles/wrapper.scss"
import Button from "./Button";
import FourOFour from "./FourOFour";
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";
import UserProfile from "./UserProfile";
import { cookies, globalContext, RRLink, valDef } from "./util";

const NavAndChatWrapper = () => {
	const { setLoggedIn } = useContext(globalContext);
	const [userIconDropdown, setUserIconDropdown] = useState(false);
	const [chatIsOpen, setChatIsOpen] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState("friends");
	useEffect(() => {

	}, [chatRef.current?.clientHeight])
	return (
		<div className="c_wrapper d100">
			{/* <img src={cookies.get("avatar")} alt="avatar" className="avatar" />
			<h1>Welcome <span>{cookies.get("name")}</span></h1> */}
			<nav className="navbar flex-jc-sb flex-ai-cr">
				<div className="navelem left"></div>
				<RRLink to="/" onClick={() => { setUserIconDropdown(false) }}>
					<div className="navelem mid">
						<h1>PONG</h1>
					</div>
				</RRLink>
				<div className="navelem right flex-center" onClick={() => { setUserIconDropdown(x => !x) }}>
					<div className="name"> {
						cookies.get("name")
					} </div>
					<div className="icon flex-center">
						<img src={cookies.get("avatar")} alt="avatar" className="avatar" />
					</div>
					<div className={"dropdown " + (userIconDropdown ? "visible" : "hidden")}>
						<RRLink to="/profile" className="profile elem no-underline flex-ai-cr flex-gap5">
							<i className="fa-solid fa-user"></i>
							<span>Profile</span>
						</RRLink>
						<div className="bar"></div>
						<RRLink to="/settings" className="settings elem no-underline flex-ai-cr flex-gap5">
							<i className="fa-solid fa-gear"></i>
							<span>Settings</span>
						</RRLink>
						<div className="bar"></div>
						<div className="logout elem flex-ai-cr flex-gap5"
							onClick={() => {
								cookies.remove("_token");
								setLoggedIn(false);
							}}
						>
							<i className="fa-solid fa-right-from-bracket"></i>
							<span>Log Out</span>
						</div>
					</div>
				</div>
			</nav>
			<Routes>
				<Route path="/" element={
					<Home/>
				}/>
				<Route path="/settings" element={
					<Settings/>
				}/>
				<Route path="/profile/:userId" element={
					<UserProfile/>
				}/>
				<Route path="/profile" element={
					<Profile/>
				}/>
				<Route path="*" element={
					<FourOFour/>
				}/>
			</Routes>
			<div id="chat-container" style={
				{
					// width: chatIsOpen ? "800px" : "44px",
					// height: chatIsOpen ? "500px" : "44px"
				}
			}>
				<div id="chat" ref={chatRef} style={
					{
						transform: chatIsOpen ? "translate(0px, 0px)" :
						`translate(calc(-100% + 50px), calc(100% - 50px))`
					}
				}>
					<div className="container top_section flex-jc-sb flex-ai-cr">
						<nav className="chatnav">
							<Button onClick={() => { setActiveTab("friends"); }}>Friends</Button>
							<Button onClick={() => { setActiveTab("chat"); }}>Chat</Button>
							<Button onClick={() => { setActiveTab("rooms"); }}>Rooms</Button>
						</nav>
						<Button className="controller flex-center" onClick={() => {
							setChatIsOpen(!chatIsOpen);
						}}>
							<i className="fa-solid fa-message"></i>
						</Button>
					</div>
					<div className="body">
						<div className="friends" style={{display: activeTab === "friends" ? "block" : "none"}}>
							friends
						</div>
						<div className="chat" style={{display: activeTab === "chat" ? "block" : "none"}}>
							chat
						</div>
						<div className="rooms" style={{display: activeTab === "rooms" ? "block" : "none"}}>
							rooms
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NavAndChatWrapper;