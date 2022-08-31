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
import io from 'socket.io-client';

const chatSocket = io("/chatNamespace");

interface ChatMessage {
	userID: string, avatar: string | null | undefined, message: string
}

const NavAndChatWrapper = () => {
	const { setLoggedIn } = useContext(globalContext);
	const [userIconDropdown, setUserIconDropdown] = useState(false);
	const [chatIsOpen, setChatIsOpen] = useState(
		// false
		true
	);
	const chatRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState(
		// "friends"
		"rooms"
	);
	const [roomActiveTab, setRoomActiveTab] = useState(
		// "public"
		"create"
	);

	const messagesRef = useRef<HTMLDivElement>(null);
	const submitRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [createRoomType, setCreateRoomType] = useState<string | null>("public");
	const [createRoomPassword, setCreateRoomPassword] = useState("");
	const [createRoomName, setCreateRoomName] = useState("");
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
	const setActiveChatMessages = (x: any) => {
		console.log(x);
		return _setActiveChatMessages(x);
	}
	const [activeChatMessages, _setActiveChatMessages] = useState<ChatMessage[]>([
		{
			// user: {
				userID: "test",
				avatar: "https://picsum.photos/40/40?grayscale"
			// }
			,
			message: "hellooo\nasdfasdf\ndsfgsdfg\nasdfasdfa\nasdfasdfasd"
		},
		{
			// user: {
				userID: cookies.get("name"),
				avatar: cookies.get("avatar")
			// }
			,
			message: "salam cv?"
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
		if (textAreaRef.current) {
			textAreaRef.current.addEventListener("keydown", function (e) {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					submitRef.current?.click();
				}
			})
		}
	})

	useEffectOnce(() => {
		chatSocket.on('connect', () => {
			console.log("connected");
		});

		chatSocket.on('disconnect', () => {
			console.log("disconnected");
		});

		chatSocket.on('RoomMessages', (_msgs) => {
			setActiveChatMessages(_msgs);
		})

		console.log("listening to messageToRoom");
		chatSocket.on('messageToRoom', (_msg) => {
			console.log("messageToRoom caught");
			setActiveChatMessages((x: any) => [...x, _msg
			/*{
				user: {
					userID: cookies.get("name"),
					avatar: cookies.get("avatar")
				},
				content: textMessage.trim()
			} */
			]);
		})

		return () => {
			chatSocket.off('connect');
			chatSocket.off('disconnect');
		};
	});

	useEffect(() => {
		setActiveChatMessages([]);
		chatSocket.emit("GetRoomMessages", activeChat);
	}, [activeChat])

	const [friends, setFriends] = useState([
	]);

	useEffectOnce(() => {
		axios.get("/chat/allMyRoom", {
			headers: {
				cookie: getCookieHeader()
			}
		}).then(res => {
			console.log({res})
			setChatRooms(res.data);
			res.data.forEach((room: any) => {
				chatSocket.emit("joinRoom", { name: room.db_chat_name, username: cookies.get("name") });
			});
		}).catch(err => {
			console.log({err})
		})
	})
	return (
		<div className="c_wrapper d100">
			{/* <img src={cookies.get("avatar")} alt="avatar" className="avatar" />
			<h1>Welcome <span>{cookies.get("name")}</span></h1> */}
			<nav className="navbar flex-jc-sb flex-ai-cr">
				<div className="navelem left"></div>
				<RRLink to="/" onClick={() => { setUserIconDropdown(false) }}>
					<div className="navelem mid">
						<h1 className="flex-center"><span>P</span><span className="circle">⬤</span><span>NG!</span></h1>
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
						<div className="chat d100 flex-column flex-gap10" style={{display: activeTab === "chat" ? "flex" : "none"}}>
							{
								chatRooms.map((room: any) => {
									return (
										<div className="room flex-jc-sb flex-ai-cr" onClick={() => {
											setActiveChatMessages([]);
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
							<section className="roomsbody flex-center-column" style={{display: roomActiveTab === "create" ? "flex" : "none"}}>
								<form action="" className="create-room-form h100 flex-column flex-jc-cr flex-gap10" onSubmit={e => {
									e.preventDefault();
									axios.post("/chat/CreateRoom/", {
										name: createRoomName,
										status: createRoomType,
										...(createRoomType === "protected" && { password: createRoomPassword })
									}, { headers: {cookie: getCookieHeader() }}).then(res => {
										console.log({res})
									})
									// console.log({createRoomName, createRoomType, createRoomPassword});
								}}>
									<div className="room_name flex-gap10">
										<div className="flex-center">
											<label htmlFor="name">Room Name:</label>
										</div>
										<input type="text" name="name" value={createRoomName} onChange={e => setCreateRoomName(e.target.value)}/>
									</div>
									<div className="type_container flex-gap10">
										<label htmlFor="type">Type:</label>
										<div className="type_radios">
											<div className="type_subcontainer flex-jc-sb flex-ai-cr">
												<label htmlFor="radio_public">Public</label>
												<input onChange={(e) => { setCreateRoomType(e.target.value); }} type="radio" name="type" id="radio_public" value="public" checked={createRoomType === "public"} />
											</div>
											<div className="type_subcontainer flex-jc-sb flex-ai-cr">
												<label htmlFor="radio_protected">Protected</label>
												<input onChange={(e) => { setCreateRoomType(e.target.value); }} type="radio" name="type" id="radio_protected" value="protected" checked={createRoomType === "protected"} />
											</div>
											<div className="type_subcontainer flex-jc-sb flex-ai-cr">
												<label htmlFor="radio_private">Private</label>
												<input onChange={(e) => { setCreateRoomType(e.target.value); }} type="radio" name="type" id="radio_private" value="private" checked={createRoomType === "private"} />
											</div>
										</div>
									</div>
									<div className="room_password_container flex-gap10" style={{visibility: createRoomType === "protected" ? "visible" : "hidden"}}>
										<div className="flex-center">
											<label htmlFor="room_password">Password:</label>
										</div>
										<input type="password" id="room_password" value={createRoomPassword} onChange={(e) => { setCreateRoomPassword(e.target.value); }}/>
									</div>
									<input type="submit" className="submit_button c_button_2" value="Create Room"/>
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
									activeChatMessages.map((msg: ChatMessage) => {
										// console.log({msg})
										// console.log({other: msg.user.userID, ana: cookies.get("name"), ft: msg.user.userID == cookies.get("name")})
										return (
											<div className={"message " + (msg.userID != cookies.get("name") ? "notmine" : "mine")}>
												{
													<div className={"container flex flex-ai-fs flex-gap10"}>
														{
															msg.userID != cookies.get("name") ?
																<div className="profilepic flex-center">
																	<img src={msg.avatar ? msg.avatar : ""} alt="user avatar" />
																</div>
															: <></>
														}
														<div className="message_text">
															{
																msg.message
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
										chatSocket.emit("saveChatRoom", { userID: cookies.get("name"), roomName: activeChat, message: textMessage})
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