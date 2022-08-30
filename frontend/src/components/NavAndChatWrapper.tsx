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
import { cookies, getCookieHeader, globalContext, RRLink, useEffectOnce, valDef } from "./util";

const NavAndChatWrapper = () => {
	const { setLoggedIn } = useContext(globalContext);
	const [userIconDropdown, setUserIconDropdown] = useState(false);
	const [chatIsOpen, setChatIsOpen] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState("friends");
	const [roomActiveTab, setRoomActiveTab] = useState("public");
	useEffect(() => {

	}, [chatRef.current?.clientHeight])

	const messagesRef = useRef<HTMLDivElement>(null);
	const submitRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [createRoomType, setCreateRoomType] = useState<string | null>("public");
	const [createRoomPassword, setCreateRoomPassword] = useState("");
	useEffect(() => {
		if (createRoomType !== "protected")
			setCreateRoomPassword("");
	}, [createRoomType])
	const [textMessage, setTextMessage] = useState("");
	const [activeChat, setActiveChat] = useState(null);
	const [chatRooms, setChatRooms] = useState([
		{
			db_chat_name: "testroom",
			db_chat_ownerID: cookies.get("name"),
			"number of users": 1,
			db_chat_owner_avatar: ""
		}
	]);
	const [activeChatMessages, setActiveChatMessages] = useState([
		{
			user: {
				userID: "test",
				avatar: "https://picsum.photos/40/40?grayscale"
			},
			content: "hellooo\nasdfasdf\ndsfgsdfg\nasdfasdfa\nasdfasdfasd"
		},
		{
			user: {
				userID: cookies.get("name"),
				avatar: cookies.get("avatar")
			},
			content: "salam cv?"
		}
	]);

	useEffectOnce(() => {
		console.log({getcookie: getCookieHeader() });
		axios.get("/chat/allpublicrooms", { headers: { cookie: getCookieHeader() } }).then((res) => {
			console.log({res});
		})
	})

	useEffect(() => {
		if (messagesRef.current)
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
	}, [activeChatMessages])

	useEffectOnce(() => {
		// console.log("test");
		if (textAreaRef.current) {
			textAreaRef.current.addEventListener("keydown", function (e) {
				const keyCode = e.key || e.which;

				// console.log("test");
				// console.log({ekey: e.key, keyCode, ewhich: e.which, eshift: e.shiftKey});
				// 13 represents the Enter key
				if (keyCode === "Enter" && !e.shiftKey) {
					// Don't generate a new line
					e.preventDefault();
					submitRef.current?.click();
					// Do something else such as send the message to back-end
					// ...
				}
			})
		}
	})

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
						<nav className="nav">
							<Button onClick={() => { setActiveTab("friends"); }} className={activeTab.startsWith("friends") ? "active" : "notactive"}>Friends</Button>
							<Button onClick={() => { setActiveTab("chat"); }} className={activeTab.startsWith("chat") ? "active" : "notactive"}>Chat</Button>
							<Button onClick={() => { setActiveTab("rooms"); }} className={activeTab.startsWith("rooms") ? "active" : "notactive"}>Rooms</Button>
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
						<div className="rooms d100 flex-column" style={{display: activeTab === "rooms" ? "flex" : "none"}}>
							<section className="top_section flex w100">
								<nav className="nav flex">
									<Button onClick={() => { setRoomActiveTab("public"); }} className={"public " + (roomActiveTab.startsWith("public") ? "active" : "notactive")}>Public</Button>
									<Button onClick={() => { setRoomActiveTab("protected"); }} className={"protected " + (roomActiveTab.startsWith("protected") ? "active" : "notactive")}>Protected</Button>
									<Button onClick={() => { setRoomActiveTab("private"); }} className={"private " + (roomActiveTab.startsWith("private") ? "active" : "notactive")}>Private</Button>
								</nav>
								<Button onClick={() => { setRoomActiveTab("create"); }} className={"createnewroom controller flex-center " + (roomActiveTab.startsWith("create") ? "active" : "notactive")}>
									<i className="fa-solid fa-plus"></i>
								</Button>
							</section>
							<section className="roomsbody" style={{display: roomActiveTab === "create" ? "flex" : "none"}}>
								<form action="">
									<div>
										<label htmlFor="name">Room Name:</label>
										<input type="text" name="name" />
									</div>
									<div>
										<label htmlFor="type">Type:</label>
										<label htmlFor="radio_public">Public</label>
										<input onChange={(e) => { setCreateRoomType(e.target.value); } }type="radio" name="type" id="radio_public" value="public" checked={createRoomType === "public"} />
										<label htmlFor="radio_protected">Protected</label>
										<input onChange={(e) => { setCreateRoomType(e.target.value); } }type="radio" name="type" id="radio_protected" value="protected" checked={createRoomType === "protected"} />
										<label htmlFor="radio_private">Private</label>
										<input onChange={(e) => { setCreateRoomType(e.target.value); } }type="radio" name="type" id="radio_private" value="private" checked={createRoomType === "private"} />
									</div>
									<div style={{display: createRoomType === "protected" ? "block" : "none"}}>
										<label htmlFor="room_password">Password:</label>
										<input type="text" id="room_password" value={createRoomPassword} onChange={(e) => { setCreateRoomPassword(e.target.value); }}/>
									</div>
									<input type="submit" value="Create Room" />
								</form>
							</section>
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
										// console.log({msg})
										// console.log({other: msg.user.userID, ana: cookies.get("name"), ft: msg.user.userID == cookies.get("name")})
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
								<textarea className="text_input" value={textMessage} ref={textAreaRef} onChange={(e) => {
									setTextMessage(e.target.value);
								}}></textarea>
								<input type="submit" hidden />
								<div className="submit flex-center" ref={submitRef} onClick={() => {
									if (textMessage.trim() != "") {
										setActiveChatMessages((x: any) => [...x, {
											user: {
												userID: cookies.get("name"),
												avatar: cookies.get("avatar")
											},
											content: textMessage.trim()
										}]);
										setTextMessage("");
									}
									textAreaRef.current?.focus();
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