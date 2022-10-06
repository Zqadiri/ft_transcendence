import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate, Params, useParams } from "react-router-dom";
import { cookies, ShowConditionally, useEffectOnce } from "./util";
import '../styles/userprofile.scss'
import Button from "./Button";
import UserOperationsButtons from "./UserOperationsButtons";

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
	Matched : boolean;
	achievement: string[] | null;
	FriendsID: number[]; 
	blockedID: number[];
	outgoingFRID: number[];
	incomingFRID: number[];
	createdAt: Date;
	updatedAt: Date | null;
	twoFacAuthSecret: string | null;
} 

const UserProfile = (props: { self: boolean }) => {
	let params = useParams();
	const [user, setUser] = useState<User | null | undefined>(null);
	const [thisuser, setThisUser] = useState<User | null | undefined>(null);
	const [usermh, setUsermh] = useState(null);
	const [editingName, setEditingName] = useState(false);
	const [editingPfp, setEditingPfp] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [enMessage, setEnMessage] = useState("");

	useEffect(() => {
		if (!editingName) {
			setDisplayName(user?.username || "");
		}
	}, [user, thisuser, editingName])

	useEffect(() => {
		let int = setInterval(() => {
			updateUserProfile(params);
		}, 2000)
		return () => clearInterval(int)
	}, [params])

	const updateUserProfile = (prm: Readonly<Params<string>>) => {
		axios.get("/game/get_match_history?name=" + (prm.userId || cookies.get("name")))
		.then((res) => {
			setUsermh(res.data)
		})
		axios.get("/users?name=" + (prm.userId || cookies.get("name")))
		.then((res) => {
			console.log({user: res});
			setUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		})
		axios.get("/users?name=" + cookies.get("name"))
		.then((res) => {
			console.log({thisuser: res});
			setThisUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		})
	}

	useEffectOnce(() => {
		updateUserProfile(params);
	})

	const uploadPfpRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log({user, thisuser, usermh})
	}, [user, thisuser])
	if (params.userId === cookies.get("name")) {
		return <Navigate to={"/profile"}></Navigate>
	}
	return (
		<div className="userprofile d100">
			<ShowConditionally cond={user && thisuser}>
				<>
					<div className="userinfo">
						<div className="top">
							<div className="imgcontainer">
								<img src={user?.avatar} className="image" alt="Profile Picture" />
								<ShowConditionally cond={user?.id === thisuser?.id}>
									<>
										<div className="editoverlay" onClick={() => {
											uploadPfpRef.current?.click();
										}}>+ Change Profile Picture</div>
										<input type="file" name="" id="" ref={uploadPfpRef} hidden onChange={() => {
											setEditingPfp(true);
										}}/>
									</>
								</ShowConditionally>
								<div className={`status ${user?.status}`}></div>
							</div>
							<ShowConditionally cond={editingPfp}>
								<div className="editpfp">
									<Button>Save</Button>
									<Button onClick={() => {
										setEditingPfp(false);
									}}>Cancel</Button>
								</div>
							</ShowConditionally>
							<div className="namecontainer">
								<input type="text" className="name" value={displayName} onChange={(e) => {
									if (editingName)
										setDisplayName(e.target.value);
								}}></input>
								<ShowConditionally cond={user?.id === thisuser?.id && !editingName}>
									<div className="iconcontainer" onClick={() => {
										setEditingName(true);
									}}>
										<i className="fa-solid fa-edit"></i>
									</div>
								</ShowConditionally>
							</div>
							<div className="editnamemessage">{enMessage}</div>
							<ShowConditionally cond={editingName}>
								<div className="editname">
									<Button onClick={() => {
										// change name axios
									}}>Save</Button>
									<Button onClick={() => {
										setEditingName(false);
									}}>Cancel</Button>
								</div>
							</ShowConditionally>
						</div>
						<ShowConditionally cond={user?.id !== thisuser?.id}>
							<UserOperationsButtons {...{ user, thisuser, updateUserProfile, params }}></UserOperationsButtons>
							<div className="bottom twofa"></div>
						</ShowConditionally>
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