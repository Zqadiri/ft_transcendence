import '../styles/defaults.scss'
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { cookies, ShowConditionally, useEffectOnce } from './util';
import { useEffect } from 'react';
import Home from './Home'
import Login from './Login';
import { globalContext } from './util';
import { useState } from 'react';

function App() {
	const [loggedIn, setLoggedIn] = useState(cookies.get("_token"));
	useEffectOnce(() => {
		console.log({cookie: cookies.get("_token")});
	})
	return (
		<div className="app w100 h100">
			<globalContext.Provider value={{
				loggedIn, setLoggedIn
			}}>
				<Routes>
					<Route path="/"
						element={
							<ShowConditionally cond={cookies.get("_token")} >
								<Home/>
								<Navigate to="/login" replace/>
							</ShowConditionally>
						}>
					</Route>
					<Route path="/login"
						element={
							<ShowConditionally cond={cookies.get("_token")} >
								<Navigate to="/" replace/> 
								<Login/>
							</ShowConditionally>
						}>
					</Route>
					<Route path="/auth/login"
						element={
							<ShowConditionally cond={cookies.get("_token")} >
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
