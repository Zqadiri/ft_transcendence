import '../styles/defaults.scss'
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { cookies, is2FA, isLoggedIn, ShowConditionally, useEffectOnce } from './util';
import { useEffect } from 'react';
import NavAndChatWrapper, { chatSocket, g_setIsMatching } from './NavAndChatWrapper'
import Login from './Login';
import { globalContext } from './util';
import { useState } from 'react';
import axios from 'axios';
import { global } from './game/PingPong/Data/PingPong.d';
import { defaultComponent, handleInvitationDeclined } from './game/GameTabs';
import { addMatchingSocketEventHandler } from './game/Matching/Matching';
import { confirm } from "react-confirm-box";
import TwoFA from './2fa';
import { invitationWaiting } from './game/Matching/Data/Matching.constants';

const options = {
	labels: {
		confirmable: "Accept",
		cancellable: "Decline"
	}
}

function App() {
	const [chatIsOpen, setChatIsOpen] = useState(
		false
		// true
	);
	const [jwtSelf, setJwtSelf] = useState({id: 0, username: ""});
	const	[loggedIn, setLoggedIn] = useState(isLoggedIn());
	const	navigate = useNavigate();
	const	currentUserId = cookies.get('id');
	const	loc = useLocation();

	useEffectOnce(() => {
		console.log({"loggedIn?": isLoggedIn()});
	})
	useEffect(() => {

		chatSocket.off(currentUserId).on(currentUserId, async (roomName: string) => 
		{
			let		declinedStatus = false;
			chatSocket.off(`${currentUserId}declinedd`).on(`${currentUserId}declinedd` , async () => {
				if (defaultComponent === invitationWaiting)
					declinedStatus = true;
			});

			const	opponentId = roomName.split(":")[1];
			let		opponentResp = await axios.get("/users?id=" + opponentId);
			const	reply = await confirm(`${opponentResp.data.username} invited you to play a game. EXPIRES IN 1min`, options);
			const	currentUserResp = await axios.get("/users?id=" + currentUserId);

			opponentResp = await axios.get("/users?id=" + opponentId);
			if (currentUserResp.data.status === "ingame" || declinedStatus || opponentResp.data.status === "ingame")
				return ;

			if (reply)
			{
				global.socket.disconnect().connect();
				global.theme = "theme01";
				
				addMatchingSocketEventHandler(navigate, loc);
				global.socket.emit("joinInvitation", {roomName: roomName, userCounter: 2})
				setChatIsOpen(false);
			}
			else
				chatSocket.emit('invitationDeclined', opponentId);
		});

		chatSocket.off(`${currentUserId}declined`).on(`${currentUserId}declined` , async () => {
			if (defaultComponent === invitationWaiting)
				handleInvitationDeclined();
		});

		
		chatSocket.off("validateJwtAck").on("validateJwtAck", (payload) => {
			if (!payload) {
				cookies.remove("_token");
				cookies.remove("avatar");
				cookies.remove("id");
				cookies.remove("name");
				document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));
				setLoggedIn(false);
			}
			else {
				setJwtSelf({id: payload.id, username: payload.username});
			}
		})	
	})
	useEffectOnce(() => {
		let inter = setInterval(() => {
			if (cookies.get("_token"))
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
				loggedIn, setLoggedIn, chatIsOpen, setChatIsOpen, jwtSelf, setJwtSelf
			}}>
				<Routes>
					<Route path="*"
						element={
							<ShowConditionally cond={isLoggedIn()} >
								<NavAndChatWrapper/>
								<ShowConditionally cond={is2FA()}>
									<Navigate to="/2fa" replace />
									<Navigate to="/login" replace />
								</ShowConditionally>
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
					<Route path="/2fa"
						element={
							<ShowConditionally cond={is2FA()}>
								<TwoFA></TwoFA>
								<Navigate to="/login" replace></Navigate>
							</ShowConditionally>
						}>
					</Route>
				</Routes>
			</globalContext.Provider>
		</div>
	);
}

export default App;
