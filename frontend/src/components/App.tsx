import '../styles/defaults.scss'
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { cookies, isLoggedIn, ShowConditionally, useEffectOnce } from './util';
import { useEffect } from 'react';
import NavAndChatWrapper from './NavAndChatWrapper'
import Login from './Login';
import { globalContext } from './util';
import { useState } from 'react';

function App() {
	const [loggedIn, setLoggedIn] = useState(isLoggedIn());
	useEffectOnce(() => {
		console.log({cookie: isLoggedIn()});
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
