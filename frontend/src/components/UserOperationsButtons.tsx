import axios from "axios";
import { Params } from "react-router-dom";
import Button from "./Button";
import { User } from "./UserProfile";
import { cookies, ShowConditionally } from "./util";

const UserOperationsButtons = ({ user, thisuser, params, updateUserProfile }: { user: User | null | undefined, thisuser: User | null | undefined, params: Readonly<Params<string>>, updateUserProfile: ((p: any) => void)}) => {
	const friendOp = (endpoint: string, u: User | null | undefined) => {
		if (u) {
			axios.post("/users" + endpoint, { id: u.id })
				.finally(() => {
					updateUserProfile(params);
				})
		}
	}

	return (
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
				<>
					<Button>This User Has Blocked You</Button>
					<ShowConditionally cond={!thisuser?.blockedID.includes(user?.id ? user.id : 0)}>
						<Button className="mutate block" onClick={() => {
							friendOp("/block_user", user);
						}}>Block User</Button>
						<Button className="mutate unblock" onClick={() => {
							friendOp("/unblock_user", user);
						}}>Unblock User</Button>
					</ShowConditionally>
				</>
			</ShowConditionally>
		</>
	)
}

export default UserOperationsButtons;