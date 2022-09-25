import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "../styles/wrapper.scss"
import Button from "./Button";
import FourOFour from "./FourOFour";
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";
import UserProfile, { User } from "./UserProfile";
import { capitalize, cookies, getCookieHeader, globalContext, RRLink, ShowConditionally, useEffectOnce, valDef } from "./util";
import io from 'socket.io-client';
import ProtectedRoom from "./ProtectedRoom";
import GameTabs from "./game/GameTabs"
import PingPong from "./game/PingPong/PingPong";
import MuteBanControls from "./MuteBanControls";
import UserProfileIcon from "./UserProfileIcon";

console.log("Global console.log()");

export const chatSocket = (() => {
	console.log("connecting to chatNamespace...");
	return io("/chatNamespace", { forceNew: true });
})();

export interface UserStat {
	id: number,
	username: string,
	avatar: string,
	stat: string,
}

export interface Chat {
	db_chat_type: string | undefined,
	db_chat_id: number,
	db_chat_name: string,
	db_chat_status: "public" | "protected" | "private" | "dm",
	"number of users": number,
	ownerName: string
}

export interface ChatMessage {
	userID: string, avatar: string | null | undefined, message: string
}

export type ActiveTab = "rooms" | "friends" | "chat" | "chatinterface" | "chatinterfaceusers";

const NavAndChatWrapper = () => {
	const { setLoggedIn } = useContext(globalContext);
	const [userIconDropdown, setUserIconDropdown] = useState(false);
	const [chatIsOpen, setChatIsOpen] = useState(
		false
		// true
	);
	const chatRef = useRef<HTMLDivElement>(null);
	const [activeTab, _setActiveTab] = useState<ActiveTab>(
		// "friends"
		"rooms"
	);


	const setActiveTab = (x: ActiveTab) => {
		if (x === "chat")
			getAllMyRooms();
		if (x === "rooms")
			getAllRooms();
		if (x === "friends")
			getFriends();
		return _setActiveTab(x);
	}
	const [roomActiveTab, _setRoomActiveTab] = useState(
		// "public"
		"create"
	);
	const setRoomActiveTab = (x: any) => {
		getAllRooms();
		return _setRoomActiveTab(x);
	}

	const messagesRef = useRef<HTMLDivElement>(null);
	const submitRef = useRef<HTMLDivElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [createRoomType, setCreateRoomType] = useState<string | null>("public");
	const [createRoomPassword, setCreateRoomPassword] = useState("");
	const [createRoomName, setCreateRoomName] = useState("");
	const [createRoomResponseMessage, _setCreateRoomResponseMessage] = useState("");
	const setCreateRoomResponseMessage = (x: any) => {
		setTimeout(() => {
			_setCreateRoomResponseMessage("");
		}, 2000);
		return _setCreateRoomResponseMessage(x);
	}
	useEffect(() => {
		if (createRoomType !== "protected")
			setCreateRoomPassword("");
	}, [createRoomType])
	const [textMessage, setTextMessage] = useState("");
	const [activeChat, _setActiveChat] = useState<Chat | null>(null);
	const setActiveChat = (newActiveChat: Chat | null) => {
		console.log({newActiveChat});
		if (newActiveChat) {
			// setActiveChatMessages([]);
			console.log("chatsokcet.emit('getroommessages')");
			chatSocket.emit("GetRoomMessages", newActiveChat.db_chat_name);
			axios.get("/chat/userStats/" + newActiveChat.db_chat_name).then(res => {
				console.log({userstats: res.data});
				setActiveChatUsers(res.data);
			}).catch((err) => {
	
			})
		}
		return _setActiveChat(newActiveChat);
	}
	const [chatRooms, setChatRooms] = useState([]);
	const [allRooms, setAllRooms] = useState([]);
	useEffect(() => {
		console.log({allRooms});
	}, [allRooms])
	const getAllRooms = () => {
		axios.get("/chat/allRooms").then((res) => {
			console.log({res});
			setAllRooms(res.data);
		})
	}
	const getAllMyRooms = () => {
		let promise = axios.get("/chat/allMyRoom")
		
		promise.then(res => {
			console.log({res})
			setChatRooms(res.data);
			res.data.forEach((room: any) => {
				// let roomName: string = room.db_chat_name;
				// console.log(`joining room, roomName: ${roomName}`);
				// chatSocket.emit("socketJoinRoom", roomName);
			});
		}).catch(err => {
			console.log({err})
		})
		return promise;
	}
	const [activeChatUsers, setActiveChatUsers] = useState<UserStat[]>([]);
	const [activeChatMessages, _setActiveChatMessages] = useState<ChatMessage[]>([]);
	const setActiveChatMessages = (x: ChatMessage[] | ((msgs: ChatMessage[]) => ChatMessage[])) => {
		console.log({newValueMessages: x});
		return _setActiveChatMessages(x);
	}

	useEffect(() => {
		console.log(activeChatUsers);
	}, [activeChatUsers])

	useEffectOnce(() => {
		getAllRooms();
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

	useEffect(() => {
		chatSocket.off('connect').on('connect', () => {
			console.log("connected");
		});

		chatSocket.off("connect_error").on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		chatSocket.off('disconnect').on('disconnect', () => {
			console.log("disconnected");
		});

		chatSocket.off('RoomMessages').on('RoomMessages', (_msgs) => {
			console.log("received room messages... setting them");
			setActiveChatMessages(_msgs);
		})

		console.log("listening to joinedRoom");
		chatSocket.off("joinedRoom").on("joinedRoom", (data) => {
			console.log("joined room...")
			console.log({data})
		})

		// socket.to("room").emit("bannedFromRoom", { roomName: "room", releaseTime: })

		chatSocket.off("messageToRoomSyn").on("messageToRoomSyn", (data) => {
			chatSocket.emit("getMessageToRoom", { userID: cookies.get("id"), messageID: data.id });
		})

		console.log("listening to messageToRoom");
		chatSocket.off('messageToRoomAck').on('messageToRoomAck', (_msg: ChatMessage) => {
			console.log("messageToRoom caught");
			console.log({_msg})
			_setActiveChatMessages((x: ChatMessage[]) => [...x, _msg]);
		})

		chatSocket.off("Muted").on("Muted", (data: {userID: number, RoomID: string}) => {
			console.log({muteddata: data, activeChat})
			if (data.userID.toString() === cookies.get("id") && activeChat?.db_chat_name === data.RoomID) {
				setActiveChat(activeChat);
				setActiveTab("chat");
			}
		})

		return () => {
			chatSocket.off('connect');
			chatSocket.off('disconnect');
		};
	});

	const getFriends = () => {
		axios.get("/users/friends_list")
		.then((res: AxiosResponse) => {
			setFriends(res.data);
		})
	}

	const [friends, setFriends] = useState<User[]>([]);

	useEffectOnce(() => {
		getAllMyRooms();
	})

	useEffect(() => {
		// console.log({activeChattttttttttttttttttttttttttt:activeChat})
	}, [activeChat])


	const [passwdMessage, _setPasswdMessage] = useState("");
	const setPasswdMessage = (pwd: string) => {
		return _setPasswdMessage(pwd);
	}

	const CRUDRoomPasswordRef = useRef<HTMLInputElement>(null);
	// useEffectOnce(() => {
	// 	let int = setInterval(() => {
	// 		axios.get("/chat/userStats/" + activeChat?.db_chat_name).then(res => {
	// 			console.log({userstats: res.data});
	// 			setActiveChatUsers(res.data);
	// 		}).catch((err) => {
	
	// 		})
	// 	}, 1000);
	// 	return (() => {
	// 		clearInterval(int);
	// 	})
	// })
	const userIcon: any = {
		"owner": "fa-solid fa-crown",
		"user": "fa-solid fa-user",
		"admin": "fa-solid fa-shield",
		"muted": "fa-solid fa-comment-slash",
		"banned": "fa-solid fa-ban"
	}

	return (
		<div className="c_wrapper d100">
			<nav className="navbar flex-jc-sb flex-ai-cr">
				<div className="navelem left"></div>
				<div className="stretch-container flex-center navelem">
					<RRLink to="/"  onClick={() => { setUserIconDropdown(false) }}>
						<div className="mid">
							<h1 className="flex-center"><span>P</span><span className="circle">⬤</span><span>NG!</span></h1>
						</div>
					</RRLink>
				</div>
				<div className="navelem flex-jc-fe flex-ai-cr" onClick={() => { setUserIconDropdown(x => !x) }}>
					<div className="container flex-center right">
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
							<div className="bar_sickl"></div>
							<RRLink to="/settings" className="settings elem no-underline flex-ai-cr flex-gap5">
								<i className="fa-solid fa-gear"></i>
								<span>Settings</span>
							</RRLink>
							<div className="bar_sickl"></div>
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
				</div>
			</nav>
			<Routes>
				<Route path="/" element={<GameTabs />}></Route>
				<Route path="/play" element={<PingPong />}></Route>
				{/* <Route path="/" element={
					<Home/>
				}/> */}
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
							{
								friends.map(fr => {
									return (
										<div className="friend" onClick={() => {

										}}>
											<div className="left flex-ai-cr flex-gap5">
												<div className="avatar flex-center">
													<img src={fr.avatar} alt="" style={{width: 30, height: 30}} />
												</div>
												<div className="info flex-column flex-gap5">
													<div className="username">{fr.username}</div>
													<div className="id">{fr.id}</div>
												</div>
											</div>
										</div>
									)
								})
							}
						</div>
						<div className="chatscroll d100" style={{display: activeTab === "chat" ? "flex" : "none"}}>
							<div className="chat w100 flex-column flex-gap10">
								{
									chatRooms.map((room: Chat) => {
										return (
											<div className="room flex-jc-sb flex-ai-cr" onClick={() => {
												// setActiveChatMessages([]);
												if (activeChat?.db_chat_name)
													chatSocket.emit("socketLeaveRoom", activeChat?.db_chat_name);
												chatSocket.emit("socketJoinRoom", room.db_chat_name);
												// if (room.db_chat_type !== "dm")
													axios.get("/chat/userStats/" + room.db_chat_name).then(res => {
														// console.log({userstats: res.data});
														let acu: UserStat[] = res.data;
														console.log({"acu.find(el => el.id === cookies.get(\"id\"))": acu.find(el => el.id === parseInt(cookies.get("id"))), acu})
														if (acu.find(el => el.id === parseInt(cookies.get("id")))?.stat !== "banned") {
															setActiveTab("chatinterface");
															setActiveChat(room);
														}
														setActiveChatUsers(res.data);
													}).catch((err) => {
											
													})
												// else {

												// }
											}}>
												<div className="left flex-column">
													<div className="name">{room.db_chat_type === "dm" ? room.db_chat_name : room.db_chat_name}</div>
													<div className="owner">{room.ownerName}</div>
												</div>
												<ShowConditionally cond={room.db_chat_type === "dm"}>
													<div className="right flex-center">
														<i className="icon fa-solid fa-user"></i>
														<div className="num">{room["number of users"]}</div>
													</div>
												</ShowConditionally>
											</div>
										);
									})
								}
							</div>
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
							<section className="roomsbody">
								<div className="container d100 flex-center-column" style={{display: roomActiveTab === "create" ? "flex" : "none"}}>
									<form action="" className="create-room-form h100 flex-column flex-jc-cr flex-gap10" onSubmit={e => {
										e.preventDefault();
										axios.post("/chat/CreateRoom/", {
											name: createRoomName,
											status: createRoomType,
											...(createRoomType === "protected" && { password: createRoomPassword })
										})
										.then(res => {
											console.log({res})
											setCreateRoomResponseMessage("Created!");
										})
										.catch((err: any) => {
											console.log({err});
											setCreateRoomResponseMessage(err.response.data.message);
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
										<div className="message align-text-center">{createRoomResponseMessage}</div>
									</form>
								</div>
								<div className="d100 publicrooms flex-column flex-gap10" style={{display: roomActiveTab === "public" ? "flex" : "none"}}>
									{
										(() => {
											let prooms = allRooms.filter((room: any) => room.db_chat_status === "public").map((room: any) => {
												return (
													<div className="room w100 flex-jc-sb flex-ai-cr">
														<div className="left flex-column">
															<div className="name">{room.db_chat_name}</div>
															<div className="owner">{room.ownerName}</div>
														</div>
														<div className="container flex-center flex-gap10">
															<div className="mid flex-center">
																<i className="icon fa-solid fa-user"></i>
																<div className="num">{room["number of users"]}</div>
															</div>
															<Button onClick={(e: any) => {
																e.preventDefault();
																axios.post("/chat/joinRoom",
																	{ name: room.db_chat_name }
																).then((res: any) => {
																	getAllRooms();
																	getAllMyRooms();
																});
															}}>Join</Button>
														</div>
													</div>
												);
											})

											if (prooms.length == 0) {
												return <div className="norooms flex-center-column d100">
													<h1>No Public Rooms Available</h1>
												</div>
											}
											return prooms;
										})()
									}
								</div>
								<div className="d100 publicrooms flex-column flex-gap10" style={{display: roomActiveTab === "protected" ? "flex" : "none"}}>
									{
										(() => {
											let prrooms =
											allRooms.filter((room: any) => room.db_chat_status === "protected").map((room: any) => {
												return (
													<ProtectedRoom {...{room, getAllRooms, getAllMyRooms}}></ProtectedRoom>
												);
											})
											if (prrooms.length == 0) {
												return <div className="norooms flex-center-column d100">
													<h1>No Protected Rooms Available</h1>
												</div>
											}
											return prrooms;
										})()
									}
								</div>
								<div className="d100 publicrooms flex-column flex-gap10" style={{display: roomActiveTab === "private" ? "flex" : "none"}}>
									{
										(() => {
											let prrooms =
											allRooms.filter((room: any) => room.db_chat_status === "private").map((room: Chat) => {
												return (
													<div className="room w100 flex-jc-sb flex-ai-cr">
														<div className="left flex-column">
															<div className="name">{room.db_chat_name}</div>
															<div className="owner">{room.ownerName}</div>
														</div>
														<div className="container flex-center flex-gap10">
															<div className="mid flex-center">
																<i className="icon fa-solid fa-user"></i>
																<div className="num">{room["number of users"]}</div>
															</div>
															<Button onClick={(e: any) => {
																e.preventDefault();
																axios.post("/chat/joinRoom",
																	{ name: room.db_chat_name }
																).then((res: any) => {
																	getAllRooms();
																	getAllMyRooms();
																});
															}}>Join</Button>
														</div>
													</div>
												);
											})
											if (prrooms.length == 0) {
												return <div className="norooms flex-center-column d100">
													<h1>No Invites To Private Rooms Available</h1>
												</div>
											}
											return prrooms;
										})()
									}
								</div>
							</section>
						</div>
						<div className="chatinterface d100 flex-column" style={{display: activeTab.startsWith("chatinterface") ? "flex" : "none"}}>
							<div className="header flex-jc-sb flex-ai-cr">
								<i className="fa-solid fa-arrow-left back" onClick={() => { setActiveTab("chat") }}></i>
								<div className="name" onClick={() => setActiveTab("chatinterface")}>{activeChat?.db_chat_name}</div>
								<div className="users" onClick={() => {
									setActiveTab("chatinterfaceusers");
									setActiveChat(activeChat);
								}}>
									<i className="fa-solid fa-user"></i>
								</div>
							</div>
							<div className="chatinterfaceusers flex-jc-fs flex-ai-cr flex-column flex-gap5" style={{display: activeTab === "chatinterfaceusers" ? "flex" : "none"}}>
								<Button className="leave" onClick={() => {
									axios.post("/chat/LeaveRoom", { name: activeChat?.db_chat_name })
									.finally(() => {
										setActiveTab("chat");
										setActiveChat(null);
									})
								}}>
									Leave Chat
								</Button>
								{
									activeChatUsers.find(el => el.username === cookies.get("name"))?.stat === "owner" ?
									<>
										<ShowConditionally cond={activeChat?.db_chat_status === "public"}>
											<div className="setpassword flex-ai-cr flex-gap10">
												<label htmlFor="roompassword">{passwdMessage}</label>
												<input type="password" ref={CRUDRoomPasswordRef}/>
												<Button onClick={() => {
													if (CRUDRoomPasswordRef.current?.value
														&& CRUDRoomPasswordRef.current?.value !== "") {
														axios.post("/chat/setPassword", { name: activeChat?.db_chat_name, password: CRUDRoomPasswordRef.current?.value })
														.then((res) => {
															setPasswdMessage("Success!");
														})
														.catch((err: AxiosError) => {
															console.log({err})
															setPasswdMessage("Error :(");
														}).finally(() => {
															setTimeout(() => {
																setPasswdMessage("")
															}, 2000);
															getAllMyRooms().then((res) => {
																let chats: Chat[] = res.data;
																_setActiveChat(x => {
																	setActiveChat(chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x);
																	return chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x;
																});
															})
														})
													}
												}}>Set New Password</Button>
											</div>
										</ShowConditionally>
										<ShowConditionally cond={activeChat?.db_chat_status === "protected"}>
											<div className="setpassword flex-ai-cr flex-gap10">
												<label htmlFor="roompassword">{passwdMessage}</label>
												<input type="password" ref={CRUDRoomPasswordRef}/>
												<Button onClick={() => {
													if (CRUDRoomPasswordRef.current?.value
														&& CRUDRoomPasswordRef.current?.value !== "") {
														axios.post("/chat/setPassword", { name: activeChat?.db_chat_name, password: CRUDRoomPasswordRef.current?.value })
															.then((res) => {
																setPasswdMessage("Success!");
															})
															.catch((err: AxiosError) => {
																console.log({ err })
																setPasswdMessage("Error :(");
															}).finally(() => {
																setTimeout(() => {
																	setPasswdMessage("")
																}, 2000);
																getAllMyRooms().then((res) => {
																	let chats: Chat[] = res.data;
																	_setActiveChat(x => {
																		setActiveChat(chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x);
																		return chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x;
																	});
																})
															})
													}
												}}>Change Password</Button>
												<Button onClick={() => {
													axios.post("/chat/RemovePassword", { name: activeChat?.db_chat_name })
													.then((res) => {
														setPasswdMessage("Success!");
													})
													.catch((err: AxiosError) => {
														console.log({err})
														setPasswdMessage("Error :(");
													}).finally(() => {
														setTimeout(() => {
															setPasswdMessage("")
														}, 2000);
														getAllMyRooms().then((res) => {
															let chats: Chat[] = res.data;
															_setActiveChat(x => {
																setActiveChat(chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x);
																return chats.find(chat => chat.db_chat_id === x?.db_chat_id) || x;
															});
														})
													})
												}}>Remove Password</Button>
											</div>
										</ShowConditionally>
									</> : (
										<></>
									)
								}
								{
									activeChatUsers.map((user: UserStat) => {
										return <>
										<div className="user flex-ai-cr flex-jc-sb">
											<div className="right flex-gap5 flex-ai-cr">
												{/* <img src={user.avatar} alt="" className="avatar" /> */}
												<UserProfileIcon avatar={user.avatar} className="avatar" ></UserProfileIcon>
												<div className="left container flex-column">
													<div className="name">{user.username}</div>
													<div className="id">{user.id}</div>
												</div>
											</div>
											{/* <div className="stat">{user.stat}</div> */}
											<div className="left flex-gap20 flex-ai-cr">
												<div className="controls flex-gap10 flex-ai-cr">
														<ShowConditionally cond={
															activeChatUsers.find(el => cookies.get("name") === el.username)
															&& (activeChatUsers.find(el => cookies.get("name") === el.username)?.stat === "owner"
																|| activeChatUsers.find(el => cookies.get("name") === el.username)?.stat === "admin")
															&& user.stat === "user"
														}>
															<>
																<MuteBanControls activeChat={activeChat} setActiveChat={setActiveChat} userID={user.id}></MuteBanControls>
															</>
														</ShowConditionally>
														<ShowConditionally cond={
															activeChatUsers.find(el => cookies.get("name") === el.username)?.stat === "owner"
															&& user.stat === "user"
														}>
															<div className="iconcontainer" title="Add User As Admin" onClick={() => {
																axios.post("/chat/setUserRoomAsAdmin", { RoomID: activeChat?.db_chat_name, userID: user.id }).then((res) => {
																	console.log({chatSetUserRoomAsAdmin: res});
																	setActiveChat(activeChat);
																}).catch((err) => {
																	console.log({chatSetUserRoomAsAdminERROR: err});
																	setActiveChat(activeChat);
																})
															}}>
																<i className="fa-solid fa-shield flex-center addadmin"><div className="plus">+</div></i>
															</div>
														</ShowConditionally>
													</div>
													<ShowConditionally cond={user.stat === "mute" || user.stat === "ban"}>
														{/* <CountDown activeChat={activeChat} setActiveChat={activeChat}></CountDown> */}
													</ShowConditionally>
													<div className="iconcontainer" title={capitalize(user.stat)}>
														<i className={userIcon[user.stat] + " userstat"} ></i>
													</div>
												</div>
										</div>
										</>
									})
								}
							</div>
							<div className="messages" ref={messagesRef} style={{display: activeTab === "chatinterface" ? "block" : "none"}}>
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
															<ShowConditionally cond={msg.userID != cookies.get("name")}>
																<p className="username">{msg.userID}</p>
															</ShowConditionally>
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
							<form className="input flex-center" style={{display: activeTab === "chatinterface" ? "flex" : "none"}} onSubmit={(e) => {
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
										chatSocket.emit("saveChatRoom", { userID: cookies.get("name"), roomName: activeChat?.db_chat_name, message: textMessage})
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