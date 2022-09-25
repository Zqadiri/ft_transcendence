import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Params, useParams } from "react-router-dom";
import { cookies, ShowConditionally } from "./util";
import '../styles/userprofile.scss'
import Button from "./Button";

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
	const [user, setUser] = useState<User | null>(null);
	const [thisuser, setThisUser] = useState<User | null>(null);

	const friendOp = (endpoint: string, u: User | null) => {
		if (u) {
			axios.post("/users" + endpoint, { id: u.id })
			.finally(() => {
				updateUserProfile(params);
			})
		}
	}

	const updateUserProfile = (prm: Readonly<Params<string>>) => {
		axios.get("/users?name=" + prm.userId)
		.then((res) => {
			console.log({user: res});
			setUser(res.data);
		})
		.catch((err) => {
			console.log({err});
		})
		axios.get("/users?name=" + cookies.get("name"))
		.then((res) => {
			console.log({thisuser: res});
			setThisUser(res.data);
		})
		.catch((err) => {
			console.log({err});
		})
	}

	useEffect(() => {
		updateUserProfile(params);
	}, [params])
	console.log({"cookies.get(\"name\")": cookies.get("name")})
	if (params.userId === cookies.get("name")) {
		return <Navigate to={"/profile"}></Navigate>
	}
	return (
		<div className="userprofile">
			<div className="leftpannel">
				<div className="imagecontainer">
					<div className="image" style={{background: `url(${user?.avatar})`}}></div>
				</div>
				<div className="namecontainer"><h2 className="name">{user?.username}</h2></div>
			</div>
			<div className="rightpannel">
				{/* <Button>Add Friend</Button> */}
				<ShowConditionally cond={user && thisuser}>
					<>
						<ShowConditionally cond={!user?.blockedID.includes(parseInt(cookies.get("id")))}>
							<>
								<ShowConditionally cond={!thisuser?.blockedID.includes(user?.id ? user.id : 0)}>
									<>
										<ShowConditionally cond={!user?.FriendsID.includes(parseInt(cookies.get("id")))}>
											<>
												<ShowConditionally cond={!user?.incomingFRID.includes(parseInt(cookies.get("id")))}>
													<>
														<ShowConditionally cond={!user?.outgoingFRID.includes(parseInt(cookies.get("id")))}>
															<Button className="mutate sendfr" onClick={() => {
																friendOp("/add_friend", user);
															}}>Send Friend Request</Button>
															<>
																<Button className="mutate acceptfr" onClick={() => {
																	friendOp("/accept_friend", user);
																}}>Accept Friend Request</Button>
																<Button className="mutate declinefr" onClick={() => {
																	friendOp("/decline_friend", user);
																}}>Decline Friend Request</Button>
															</>
														</ShowConditionally>
													</>
													<Button className="mutate cancelfr" onClick={() => {
														friendOp("/cancel_friend", user);
													}}>Cancel Friend Request</Button>
												</ShowConditionally>
											</>
											<Button className="mutate unfriend" onClick={() => {
												friendOp("/remove_friend", user);
											}}>Unfriend</Button>
										</ShowConditionally>
										<Button className="mutate block" onClick={() => {
											friendOp("/block_user", user);
										}}>Block User</Button>
									</>
									<Button className="mutate unblock" onClick={() => {
										friendOp("/unblock_user", user);
									}}>Unblock User</Button>
								</ShowConditionally>
							</>
							<Button>This User Has Blocked You</Button>
						</ShowConditionally>
					</>
				</ShowConditionally>
			</div>
		</div>
	);
}
 
export default UserProfile;