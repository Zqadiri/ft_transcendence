import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Params, useParams } from "react-router-dom";
import { cookies, ShowConditionally } from "./util";
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

const UserProfile = () => {
	let params = useParams();
	const [user, setUser] = useState<User | null | undefined>(null);
	const [thisuser, setThisUser] = useState<User | null | undefined>(null);
	const [usermh, setUsermh] = useState(null);



	const updateUserProfile = (prm: Readonly<Params<string>>) => {
		axios.get("/game/get_match_history?name=" + prm.userId)
		.then((res) => {
			setUsermh(res.data)
		})
		axios.get("/users?name=" + prm.userId)
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

	useEffect(() => {
		updateUserProfile(params);
	}, [params])

	useEffect(() => {
		console.log({user, thisuser, usermh})
	}, [user, thisuser])
	// console.log({"cookies.get(\"name\")": cookies.get("name")})
	if (params.userId === cookies.get("name")) {
		return <Navigate to={"/profile"}></Navigate>
	}
	return (
		<div className="userprofile d100">
			<ShowConditionally cond={user && thisuser}>
				<>
					<div className="top">
						<div className="background w100"></div>
						<div className="activearea w100 flex-jc-sb flex-ai-fs">
							<div className="left flex-center-column">
								<div className="imagecontainer flex-center">
									{/* <div className="image" style={{ background: `url(${user?.avatar})` }}></div> */}
									<div className="before flex-center">
										<img src={user?.avatar} alt="Profile Picture" className="image" />
									</div>
								</div>
								<div className="namecontainer flex-center"><h2 className="name">{user?.username}</h2></div>
							</div>
							<div className="right flex-center flex-gap5">
								<UserOperationsButtons {...{ user, thisuser, updateUserProfile, params }}></UserOperationsButtons>
							</div>
						</div>
					</div>
				</>
				<ShowConditionally cond={user === undefined}>
					<div className="notfound d100 flex-center">
						<div className="dotinner">
							No Such User
						</div>
					</div>
					<div>Loading</div>
				</ShowConditionally>
			</ShowConditionally>
		</div>
	);
}
 
export default UserProfile;