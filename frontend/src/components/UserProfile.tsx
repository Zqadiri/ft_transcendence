import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, Params, useParams, useSearchParams } from "react-router-dom";
import { cookies, globalContext, ShowConditionally, useEffectOnce } from "./util";
import '../styles/userprofile.scss'
import Button from "./Button";
import UserOperationsButtons from "./UserOperationsButtons";
import { ReactComponent as StarMedal1 } from "../img/1-star-medal.svg";
import { ReactComponent as StarMedal2 } from "../img/2-star-medal.svg";
import { ReactComponent as StarMedal3 } from "../img/3-star-medal.svg";
import { ReactComponent as StarMedal4 } from "../img/4-star-medal.svg";
import { ReactComponent as StarMedal5 } from "../img/5-star-medal.svg";
import { ReactComponent as StarMedal6 } from "../img/6-star-medal.svg";
import ReactTooltip from "react-tooltip";
import { chatSocket } from "./NavAndChatWrapper";

export type Achievement = "firstGame" | "levelThree" | "levelSix" | "closeCall" | "flawLessWin" | "flawLessWinStreak"

const achievementSvg: { name: Achievement, svg: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {title?: string | undefined;}>, title: string, desc: string}[] = [
	{ name: "firstGame", svg: StarMedal1, title: "First Game", desc: "Play your first game" },
	{ name: "levelThree", svg: StarMedal2, title: "Level 3", desc: "Reach level 3" },
	{ name: "levelSix", svg: StarMedal3, title: "Level 6", desc: "Reach level 6" },
	{ name: "closeCall", svg: StarMedal4, title: "Close Call", desc: "Win 10 - 9 against someone" },
	{ name: "flawLessWin", svg: StarMedal5, title: "Flawless Win", desc: "Win 10 - 0 against someone" },
	{ name: "flawLessWinStreak", svg: StarMedal6, title: "Flawless Winstreak", desc: "Win 10 - 0 five times" },
]

export interface User {
	id: number;
	username: string;
	avatar: string;
	email: string;
	is2FacAuth: boolean;
	status: 'online' | 'offline' | 'ingame';
	gameCounter: number;
	wins: number;
	losses: number;
	level: number;
	xp: number;
	rank: string;
	Matched: boolean;
	achievement: Achievement[] | null;
	FriendsID: number[]; 
	blockedID: number[];
	outgoingFRID: number[];
	incomingFRID: number[];
	createdAt: Date;
	updatedAt: Date | null;
	twoFacAuthSecret: string | null;
} 

interface Game {
	id: number;
    socketRoom: string;
	isPlaying:boolean;
	firstPlayerID: number;
	secondPlayerID: number;
	firstPlayerScore: number;
	secondPlayerScore: number;
	opponentPlayerAvatar: string | undefined;
	opponentPlayerName: string | undefined;
	theme: string;
	createdAt: Date;
	modifiedAt: Date;
	finishedAt: Date;
}

const UserProfile = (props: { self: boolean }) => {
	const { setLoggedIn } = useContext(globalContext);
	let params = useParams();
	let [sparams, __] = useSearchParams();
	const [user, setUser] = useState<User | null | undefined>(null);
	const [thisuser, setThisUser] = useState<User | null | undefined>(null);
	const [usermh, setUsermh] = useState<Game[]>([]);
	const [editingName, _setEditingName] = useState(sparams.get("ft") ? true : false);
	const [editingPfp, _setEditingPfp] = useState(false);
	const [qrCode, setQrCode] = useState("");
	const [twofaCode, setTwofaCode] = useState("");
	const setEditingPfp: React.Dispatch<React.SetStateAction<boolean>> = (x) => {
		if (x === false) {
			setTimeout(() => {
				setEnMessage("")
			}, 1000)
		}
		_setEditingPfp(x);
	}
	const setEditingName: React.Dispatch<React.SetStateAction<boolean>> = (x) => {
		if (x === false) {
			setTimeout(() => {
				setEnMessage("")
			}, 1000)
		}
		_setEditingName(x);
	}
	const [displayName, setDisplayName] = useState("");
	const [displayImage, setDisplayImage] = useState("");
	const [uploadFileImage, setUploadFileImage] = useState<File>();
	const [enMessage, setEnMessage] = useState("");
	function _imageEncode (arrayBuffer: any) {
		let u8 = new Uint8Array(arrayBuffer)
		let b64encoded = btoa(String([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},'')))
		let mimetype="image/png"
		return "data:"+mimetype+";base64,"+b64encoded
	}


	// function toDataURL(url: string, callback: Function) {
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.onload = function() {
	// 	  var reader = new FileReader();
	// 	  reader.onloadend = function() {
	// 		callback(reader.result);
	// 	  }
	// 	  reader.readAsDataURL(xhr.response);
	// 	};
	// 	xhr.open('POST', url);
	// 	xhr.responseType = 'blob';
	// 	xhr.send();
	//   }
	useEffect(() => {
		if (user && thisuser && user.id === thisuser.id && !thisuser.is2FacAuth && qrCode === "") {
			axios.post("/two-factor-authentication/generate", undefined, { responseType: 'blob' })
			.then(res => {
				var reader = new FileReader();
				reader.onloadend = function () {
					setQrCode(String(reader.result));
				}
				reader.readAsDataURL(res.data);
			})
			.catch(err => console.log({errqr: err}))
		}
	}, [user, thisuser, qrCode])
	useEffect(() => {
		if (!editingName) {
			setDisplayName(user?.username || "");
		}
	}, [user, thisuser, editingName])

	useEffect(() => {
		if (!editingPfp) {
			setDisplayImage(user?.avatar || "");
		}
	}, [user, thisuser, editingPfp])

	const [statusHidden, setStatusHidden] = useState(true);

	useEffect(() => {
		let int = setInterval(() => {
			updateUserProfile(params);
		}, 2000)
		return () => {clearInterval(int)}
	}, [params.userId])

	useEffect(() => {
		updateUserProfile(params);
	}, [params.userId])

	const updateUserProfile = (prm: Readonly<Params<string>>) => {
		console.log("called? updateuserprofile")
		let prom = []
		prom.push(axios.get("/game/get_match_history?" + (prm.userId ? "name=" + prm.userId : "id=" + cookies.get("id")))
		.then((res) => {
			setUsermh(res.data)
		}))
		prom.push(axios.get("/users?" + (prm.userId ? "name=" + prm.userId : "id=" + cookies.get("id")))
		.then((res) => {
			console.log({user: res});
			setUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		}))
		prom.push(axios.get("/users?id=" + cookies.get("id"))
		.then((res) => {
			console.log({thisuser: res});
			setThisUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		}))
		return prom;
	}

	useEffectOnce(() => {
		chatSocket.disconnect().connect();
		updateUserProfile(params);
		let tim = setTimeout(() => {
			updateUserProfile(params);
			setStatusHidden(false);
		}, 500)
		return () => {
			clearTimeout(tim);
		}
	})

	const readURL = (file: File) => {
		return new Promise((res, rej) => {
			const reader = new FileReader();
			reader.onload = e => res(String(e.target?.result));
			reader.onerror = e => rej(e);
			reader.readAsDataURL(file);
		});
	};


	useEffect(() => {
		if (editingName && user?.username && displayName != user.username && displayName.length < 13) {
			let tim = setTimeout(() => {
				axios.get("/users?name=" + displayName).then(() => {
					setEnMessage("Name Unavailable")
				}).catch(() => {
					setEnMessage("Name Available")
				})
			}, 500)
			return () => {
				clearTimeout(tim);
			}
		}
		else if (displayName.length > 12) {
			setEnMessage("Name Is Too Long (max: 12)")
		}
	}, [displayName, editingName, user])

	const uploadPfpRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log({user, thisuser, usermh})
	}, [user, thisuser])
	if (params.userId === cookies.get("name")) {
		return <Navigate to={"/profile"} replace></Navigate>
	}
	return (
		<div className="userprofile d100 flex">
			<ShowConditionally cond={user && thisuser}>
				<>
					{/* <div className="userinfowrapper d100 flex"> */}
						<div className="userinfo flex-column flex-ai-cr flex-jc-sa flex-gap5 d100">
							<div className="top flex-column-center flex-gap10">
								<div className="imgcontainer">
									<div style={{backgroundImage: `url(${displayImage})`}} className="image" />
									<ShowConditionally cond={user?.id === thisuser?.id && !editingPfp}>
										<>
											<div className="editoverlay flex-center-column d100" onClick={() => {
												uploadPfpRef.current?.click();
											}}>
												<div className="inner align-text-center">+&nbsp;Change Profile Picture</div>
											</div>
											<input type="file" name="" id="" ref={uploadPfpRef} accept="image/*" hidden onChange={(e) => {
												if (e.target.files) {
													console.log("upload image...")
													console.log({etarget: e.target})
													setUploadFileImage(e.target.files[0])
													readURL(e.target.files[0]).then((res) => {
														setDisplayImage(String(res));
													})
												}
												setEditingPfp(true);
											}}/>
										</>
									</ShowConditionally>
									<div className={`status ${user?.status}`} style={{ display: statusHidden ? "none" : "block"}}></div>
								</div>
								<ShowConditionally cond={editingPfp}>
									<div className="editinfo flex-center flex-gap5 editpfp">
										<Button onClick={() => {
											if (uploadFileImage) {
												var formdata = new FormData();
												formdata.append("file", uploadFileImage, "[PROXY]");
												var config = {
													method: 'post',
													url: '/users/upload_avatar',
													headers: {
														'Content-Type': 'multipart/form-data'
													},
													data: formdata
												};

												axios(config)
												.then(function (response) {
													// console.log(JSON.stringify(response.data));
													// setEnMessage("Success!")
													// setTimeout(() => {
													// 	setEnMessage("");
													// }, 2000)
												})
												.catch(function (error) {
													console.log(error);
												})
												.finally(() => {
													setEditingPfp(false);
													updateUserProfile(params);
													setLoggedIn(false);
													setLoggedIn(true);
												})
											}

										}} className="save">Save</Button>
										<Button onClick={() => {
											setEditingPfp(false);
										}} className="cancel">Cancel</Button>
									</div>
								</ShowConditionally>
								<div className="namecontainer">
									<input type="text" className="name" readOnly={Boolean(thisuser && user) && thisuser?.id !== user?.id} value={displayName} style={{width: `calc(${displayName.length}ch + 60px)`, ...(displayName.length > 12 && { backgroundColor: "red" })}} onChange={(e) => {
										if (editingName) {
											setDisplayName(e.target.value);
										}
									}}>
									</input>
									<ShowConditionally cond={user?.id === thisuser?.id && !editingName}>
										<div className="iconcontainer flex-center-column" onClick={() => {
											setEditingName(true);
										}}>
											<i className="fa-solid fa-edit"></i>
										</div>
									</ShowConditionally>
								</div>
								<div className="editnamemessage align-text-center">{enMessage}</div>
								<ShowConditionally cond={editingName}>
									<div className="editinfo flex-center flex-gap5 editname">
										<Button onClick={() => {
											if (displayName.length < 13)
												axios.post("/users/update_username", { username: displayName })
												.then((res) => {
													setEnMessage("Success!")
													setTimeout(() => {
														setEnMessage("");
													}, 2000)
												}).catch((err) => {
													setEnMessage("Failed :(")
													setTimeout(() => {
														setEnMessage("");
													}, 2000)
												}).finally(() => {
													setEditingName(false);
													updateUserProfile(params);
													setLoggedIn(false);
													setLoggedIn(true);
												})
										}} className="save">Save</Button>
										<Button onClick={() => {
											setEditingName(false);
										}} className="cancel">Cancel</Button>
									</div>
								</ShowConditionally>
								<ShowConditionally cond={user?.id !== thisuser?.id}>
									<div className="userop flex-center flex-gap5 flex-wrap">
										<UserOperationsButtons {...{ user, thisuser, updateUserProfile, params }}></UserOperationsButtons>
									</div>
								</ShowConditionally>
							</div>
							<ShowConditionally cond={user?.id !== thisuser?.id}>
								<div></div>
								<div className="bottom flex-center-column flex-gap10 twofa">
									<ShowConditionally cond={!thisuser?.is2FacAuth}>
										<img src={qrCode} alt="qrcode" className="qrcode"/>
									</ShowConditionally>
									<input type="password" value={twofaCode} onChange={(e) => { setTwofaCode(e.target.value) }}/>
									<ShowConditionally cond={thisuser?.is2FacAuth}>
										<Button onClick={() => {
											axios.post("/two-factor-authentication/turn-off", { twoFacAuthCode: twofaCode }).then((res) => {
												setEnMessage("Success!")
												setTimeout(() => {
													setEnMessage("");
												}, 2000)
											}).catch(err => {
												setEnMessage(String(err.response.data.message))
												setTimeout(() => {
													setEnMessage("");
												}, 2000)
											}).finally(() => {
												updateUserProfile(params);
											})
										}}>Turn Off 2fa</Button>
										<Button onClick={() => {
											axios.post("/two-factor-authentication/turn-on", { twoFacAuthCode: twofaCode }).then((res) => {
												setEnMessage("Success!")
												setTimeout(() => {
													setEnMessage("");
												}, 2000)
											}).catch(err => {
												setEnMessage(String(err.response.data.message))
												setTimeout(() => {
													setEnMessage("");
												}, 2000)
											}).finally(() => {
												updateUserProfile(params);
											})
										}}>Turn On 2fa</Button>
									</ShowConditionally>
								</div>
							</ShowConditionally>
						</div>
					{/* </div> */}
					<div className="usergameinfo flex-column flex-gap20">
						<div className="usermatch-history flex-column">
							<div className="header">
								<h1>Match History</h1>
								<div className="userstats">
									<span className="user-rank">Rank: {user?.rank}</span>
									<span className="user-xp">Xp: {user?.xp}</span>
									<span className="user-level">Level: {user?.level}</span>
									<span className="user-wins">Wins: {user?.wins}</span>
									<span className="user-losses">Losses: {user?.losses}</span>
								</div>
							</div>
							<div className="container">
								<ul>
									{
										usermh && usermh.map(game => {
											return (
												<li className="flex-ai-cr">
													<div className="firstPlayer flex-jc-fe flex-ai-cr">
														<h3>{user && thisuser && user.id === thisuser.id ? cookies.get('name') : user?.username}</h3>
														<div className="avatar" style={{
															backgroundImage: `url(${user && thisuser && user.id === thisuser.id ? cookies.get('avatar') : user?.avatar})`,
														}}></div>
													</div>
													<div className="match-results">
														<h3>{user && user.id === game.firstPlayerID ? game.firstPlayerScore : game.secondPlayerScore}</h3>
														<h3>-</h3>
														<h3>{user && user.id === game.firstPlayerID ? game.secondPlayerScore : game.firstPlayerScore}</h3>
													</div>
													<div className="secondPlayer flex-jc-fs flex-ai-cr">
														<div className="avatar" style={{
															backgroundImage: `url(${game.opponentPlayerAvatar})`,
														}}></div>
														<h3>{game.opponentPlayerName}</h3>
													</div>
												</li>
											);
										})
									}
								</ul>
							</div>
						</div>
						<div className="achievements flex-column flex-gap30">
							<h1>Achievements</h1>
							<div className="inner flex-gap10 flex-ai-cr">
								{
									achievementSvg.map(ac => {
										return (
											<>
												<div className={"ac flex-column-center " + (user?.achievement?.includes(ac.name) ? "on" : "off")} >
													<ac.svg data-tip={ac.desc} className={"svg " + (user?.achievement?.includes(ac.name) ? "on" : "off")}></ac.svg>
													<div className="title">{ac.title}</div>
													<div className={"desc " + (user?.achievement?.includes(ac.name) ? "on" : "off")}>{ac.desc}</div>
													{/* <ReactTooltip backgroundColor="black"></ReactTooltip> */}
												</div>
											</>
										)
									})
								}
							</div> 
						</div>
					</div>
				</>
				<div className="notfound d100 flex-center">
					<div className="dotinner">
						<ShowConditionally cond={user === undefined}>
							<>No User Called "{params.userId || cookies.get("name")}"</>
							<>Loading</>
						</ShowConditionally>
					</div>
				</div>
			</ShowConditionally>
		</div>
	);
}
 
export default UserProfile;