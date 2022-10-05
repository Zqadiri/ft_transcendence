import '../styles/defaults.scss'
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { cookies, isLoggedIn, ShowConditionally, useEffectOnce } from './util';
import { useEffect } from 'react';
import NavAndChatWrapper, { chatSocket } from './NavAndChatWrapper'
import Login from './Login';
import { globalContext } from './util';
import { useState } from 'react';
import axios from 'axios';
import { global } from './game/PingPong/Data/PingPong.d';
import { handleInvitationDeclined } from './game/GameTabs';
import { addMatchingSocketEventHandler } from './game/Matching/Matching';
import { confirm } from "react-confirm-box";


const options = {
	labels: {
		confirmable: "Accept",
		cancellable: "Decline"
	}
}

function App() {
	const	[loggedIn, setLoggedIn] = useState(isLoggedIn());
	const	navigate = useNavigate();
	const	currentUserId = cookies.get('id');

	useEffectOnce(() => {
		console.log({"loggedIn?": isLoggedIn()});
	})
	useEffect(() => {

		chatSocket.off(currentUserId).on(currentUserId, async (roomName: string) => 
		{
			let		declinedStatus = false;
			chatSocket.off(`${currentUserId}declinedd`).on(`${currentUserId}declinedd` , async () => {
				declinedStatus = true;
			});

			const	opponentId = roomName.split(":")[1];
			const	userResp = await axios.get("/users?id=" + opponentId);
			const	reply = await confirm(`${userResp.data.username} invited you to play a game`, options);
			const	currentUserResp = await axios.get("/users?id=" + currentUserId);

			if (currentUserResp.data.status === "ingame" || declinedStatus)
				return ;

			if (reply)
			{
				global.socket.connect();
				global.theme = "theme01";

				addMatchingSocketEventHandler(navigate);
				global.socket.emit("joinInvitation", {roomName: roomName, userCounter: 2})
			}
			else
				chatSocket.emit('invitationDeclined', {friendId: opponentId, currentId: currentUserId});
		});

		chatSocket.off(`${currentUserId}declined`).on(`${currentUserId}declined` , async () => {
			handleInvitationDeclined();
		});

		chatSocket.off("validateJwtAck").on("validateJwtAck", (payload) => {
			// console.log({validatejwtpayload: payload})
			if (!payload) {
				cookies.remove("_token");
				cookies.remove("avatar");
				cookies.remove("id");
				cookies.remove("name");
				document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));
				setLoggedIn(false);
			}
		})	
	})
	useEffectOnce(() => {
		let inter = setInterval(() => {
			chatSocket.emit("validateJwtSyn", cookies.get("_token"));
			// axios.get("/users?name=" + cookies.get("name")).then(() => { })
			// 	.catch(() => {
			// 		cookies.remove("_token");
			// 		cookies.remove("avatar");
			// 		cookies.remove("id");
			// 		cookies.remove("name");
			// 		setLoggedIn(false);
			// 	})
		}, 1000);
		return () => {
			clearInterval(inter);
		}
	})
	return (
		<div className="app w100 h100">
			<globalContext.Provider value={{
				loggedIn, setLoggedIn
			}}>
				<Routes>
					<Route path="*"
						element={
							<ShowConditionally cond={isLoggedIn()} >
								<NavAndChatWrapper/>
								<Navigate to="/login" replace/>
							</ShowConditionally>
						}>
					</Route>
					<Route path="/login"
						element={
							<ShowConditionally cond={isLoggedIn()} >
								<Navigate to="/" replace/> 
								<Login/>
							</ShowConditionally>
						}>
					</Route>
					<Route path="/auth/login"
						element={
							<ShowConditionally cond={isLoggedIn()} >
								<Navigate to="/" replace/> 
								<Login/>
							</ShowConditionally>
						}>
					</Route>
				</Routes>
			</globalContext.Provider>
		</div>
	);
}

export default App;
