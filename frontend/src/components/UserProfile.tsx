import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { cookies } from "./util";

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
	FriendsID: number[] | null; 
	blockedID: number[] | null;
	addFriendID: string[] | null;
	createdAt: Date;
	updatedAt: Date | null;
	twoFacAuthSecret: string | null;
} 

const UserProfile = () => {
	let params = useParams();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		axios.get("/users?name=" + params.userId)
		.then((res) => {
			console.log(res);
			setUser(res.data);
		})
		.catch((err) => {
			console.log({err});
		})
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
				
			</div>
		</div>
	);
}
 
export default UserProfile;