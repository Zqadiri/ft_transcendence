import axios from "axios";
import { useRef } from "react";
import { Chat, chatSocket } from "./NavAndChatWrapper";
import { cookies } from "./util";

const MuteBanControls = ({ activeChat, userID, setActiveChat }: { activeChat: Chat | null, userID: number, setActiveChat: Function}) => {
	const muteBanDurationRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<input type="number" min={1} className="duration" defaultValue={1} ref={muteBanDurationRef} />
			<label htmlFor="duration">sec(s)</label>
			<div className="iconcontainer" title="Mute User Temporarily" onClick={() => {
				axios.post("/chat/MuteUser", {
					RoomID: activeChat?.db_chat_name,
					userID,
					duration: parseInt(muteBanDurationRef.current?.value || "0"),
					action: "mute"
				}).then((res) => {
					console.log({resmuteban :res})
				}).catch(() => {

				}).finally(() => {
					setActiveChat(activeChat)
				})
			}}>
				<i className="fa-solid fa-volume-xmark"></i>
			</div>
			<div className="iconcontainer" title="Ban User Temporarily" onClick={() => {
				axios.post("/chat/MuteUser", {
					RoomID: activeChat?.db_chat_name,
					userID,
					duration: parseInt(muteBanDurationRef.current?.value || "0"),
					action: "ban"
				}).then((res) => {
					chatSocket.emit("SocketMuteUser", {
						RoomID: activeChat?.db_chat_name,
						userID,
						duration: parseInt(muteBanDurationRef.current?.value || "0"),
						action: "ban",
						// token: cookies.get("_token")
					})
					console.log({resmuteban :res})
				}).catch(() => {

				}).finally(() => {
					setActiveChat(activeChat)
				})
			}}>
				<i className="fa-solid fa-circle-xmark"></i>
			</div>
		</>
	)
}

export default MuteBanControls;