import './App.css';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate
} from 'react-router-dom';


import { io } from "socket.io-client";
import React, { useEffect, useState, useRef }  from 'react';

const	socket = io("http://localhost:3001/");
let		roomName;
let		messageContent;

function useEffectOnce(callback) {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	});
}

function ChatRoom() {
	const [msg, setMsg] = useState([]);

	useEffectOnce(() => {
		socket.on("chatToClient", (data) => {
			setMsg(current => [...current, data]);
		});
	});
	const	sendMessage = () => {
		socket.emit("chatToServer", { room: roomName, content: messageContent } );
	}
	return (
		<div className="container" style={{ height: window.innerHeight }}>
			<div className="center">
				<h2>{roomName}</h2>
				<textarea 
					placeholder="enter some text..."
					onChange={(e) => {
						messageContent = e.target.value;
					}}>
				</textarea>
				<button className="Chat-Button" onClick={sendMessage}>Send</button>
				<div>
					{
						msg.map((element, i) => {
							return <p key={i}>{element}</p>;
						})
					}
				</div>
			</div>
		</div>
	);
}

function MatchingButton() {

	const navigate = useNavigate();

	useEffectOnce(() => {
		socket.on("joinedRoom", (data) => {
			roomName = data;
			navigate('/chat');
		});
	});

	const joinRoom = () => {
		socket.emit("joinNewRoom");
	};
	return (
		<div className="container" style={{ height: window.innerHeight }}>
			<button className="Match-Button center" onClick={joinRoom}>Match Me</button>
		</div>
	);
}

function App() {
	return (
		<Router>
			<Routes>
				<Route exact path='/' element={< MatchingButton />}></Route>
				<Route exact path='/chat' element={< ChatRoom />}></Route>
			</Routes>
		</Router>
	);
}

export default App;
