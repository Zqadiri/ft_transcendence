import axios from "axios";
import { useState } from "react";
import Button from "./Button";
import { getCookieHeader } from "./util";

const ProtectedRoom = ({ room, getAllRooms, getAllMyRooms, key }: any) => {
	const [roomPasswordInput, setRoomPasswordInput] = useState("");
	const [placeholder, setPlaceholder] = useState("Room Password")
	return (
		<div className="room w100 flex-jc-sb flex-ai-cr" key={key}>
			<div className="left flex-column">
				<div className="name">{room.db_chat_name}</div>
				<div className="owner">{room.ownerName}</div>
			</div>
			<div className="container flex-center flex-gap10">
				<div className="mid flex-center">
					<i className="icon fa-solid fa-user"></i>
					<div className="num">{room["number of users"]}</div>
				</div>
				<input type="password" placeholder={placeholder} className="passwordinput" value={roomPasswordInput} onChange={(e) => { setRoomPasswordInput(e.target.value); }} />
				<Button onClick={(e: any) => {
					e.preventDefault();
					axios.post("/chat/joinRoom",
						{ name: room.db_chat_name, password: roomPasswordInput },
					).then((res: any) => {
						getAllRooms();
						getAllMyRooms();
					}).catch((e) => {
						setPlaceholder(e.response.data.message)
						setRoomPasswordInput("")
					});
				}}>Join</Button>
			</div>
		</div>
	)
}

export default ProtectedRoom;