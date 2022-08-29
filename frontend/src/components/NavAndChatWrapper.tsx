import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "../styles/wrapper.scss"
import Button from "./Button";
import FourOFour from "./FourOFour";
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";
import UserProfile from "./UserProfile";
import { cookies, globalContext, RRLink, useEffectOnce, valDef } from "./util";

const NavAndChatWrapper = () => {
	const { setLoggedIn } = useContext(globalContext);
	const [userIconDropdown, setUserIconDropdown] = useState(false);
	const [chatIsOpen, setChatIsOpen] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState("friends");
	useEffect(() => {

	}, [chatRef.current?.clientHeight])

	const messagesRef = useRef<HTMLDivElement>(null);
	const submitRef = useRef<HTMLDivElement>(null);

	const [textMessage, setTextMessage] = useState("");
	const [activeChat, setActiveChat] = useState(null);
	const [chatRooms, setChatRooms] = useState([
		{
			db_chat_name: "testroom",
			db_chat_ownerID: "isaadi",
			"number of users": 1
		}
	]);
	const [activeChatMessages, setActiveChatMessages] = useState([
		{
			user: {
				userID: "test",
				avatar: "https://via.placeholder.com/40x40"
			},
			content: "hellooo\nasdfasdf\ndsfgsdfg\nasdfasdfa\nasdfasdfasd"
		},
		{
			user: {
				userID: "isaadi",
				avatar: cookies.get("avatar")
			},
			content: "salam cv?"
		}
	]);

	useEffect(() => {
		if (messagesRef.current)
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
	}, [activeChatMessages])

	const [friends, setFriends] = useState([
	]);

	useEffectOnce(() => {
		// axios.get("/chat/allMyRoom", {
		// 	headers: {
		// 		cookie: "_token=" + cookies.get("_token") + ";"
		// 	}
		// }).then(res => {
		// 	console.log({res})
		// 	setChatRooms(res.data);
		// }).catch(err => {
		// 	console.log({err})
		// })

	})
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
							{
								chatRooms.map((room: any) => {
									return (
										<div className="room flex-jc-sb flex-ai-cr" onClick={() => {
											setActiveTab("chatinterface");
											setActiveChat(room.db_chat_name);
										}}>
											<div className="left flex-column">
												<div className="name">{room.db_chat_name}</div>
												<div className="owner">{room.db_chat_ownerID}</div>
											</div>
											<div className="right flex-center">
												<i className="icon fa-solid fa-user"></i>
												<div className="num">{room["number of users"]}</div>
											</div>
										</div>
									);
								})
							}
						</div>
						<div className="rooms" style={{display: activeTab === "rooms" ? "block" : "none"}}>
							rooms
						</div>
						<div className="chatinterface d100 flex-column" style={{display: activeTab === "chatinterface" ? "flex" : "none"}}>
							<div className="header flex-jc-sb flex-ai-cr">
								<i className="fa-solid fa-arrow-left back" onClick={() => { setActiveTab("chat") }}></i>
								<div className="name">{activeChat}</div>
								<div className="users">
									<i className="fa-solid fa-user"></i>
								</div>
							</div>
							<div className="messages" ref={messagesRef}>
								<div className="msgcontainer flex-column flex-jc-fe">
								{
									activeChatMessages.map((msg: any) => {
										console.log({msg})
										console.log({other: msg.user.userID, ana: cookies.get("name"), ft: msg.user.userID == cookies.get("name")})
										return (
											<div className={"message " + (msg.user.userID != cookies.get("name") ? "notmine" : "mine")}>
												{
													<div className={"container flex flex-ai-fs flex-gap10"}>
														{
															msg.user.userID != cookies.get("name") ?
																<div className="profilepic flex-center">
																	<img src={msg.user.avatar} alt="user avatar" />
																</div>
															: <></>
														}
														<div className="message_text">
															{
																msg.content
															}
														</div>
													</div>
												}
											</div>
										);
									})
								}
								</div>
							</div>
							<form className="input flex-center" onSubmit={(e) => {
								e.preventDefault();
								if (submitRef.current)
									submitRef.current.click();
							}}>
								<input type="text" value={textMessage} onChange={(e) => {
									setTextMessage(e.target.value);
								}}/>
								<input type="submit" hidden />
								<div className="submit flex-center" ref={submitRef} onClick={() => {
									if (textMessage != "") {
										setActiveChatMessages((x: any) => [...x, {
											user: {
												userID: cookies.get("name"),
												avatar: cookies.get("avatar")
											},
											content: textMessage
										}])
										setTextMessage("")
									}
								}}>
									<i className="fa-solid fa-paper-plane"></i>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NavAndChatWrapper;