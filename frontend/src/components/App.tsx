import '../styles/defaults.scss'
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { cookies, isLoggedIn, ShowConditionally, useEffectOnce } from './util';
import { useEffect } from 'react';
import NavAndChatWrapper, { chatSocket } from './NavAndChatWrapper'
import Login from './Login';
import { globalContext } from './util';
import { useState } from 'react';
import axios from 'axios';

function App() {
	const [loggedIn, setLoggedIn] = useState(isLoggedIn());
	useEffectOnce(() => {
		console.log({"loggedIn?": isLoggedIn()});
	})
	useEffect(() => {
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
