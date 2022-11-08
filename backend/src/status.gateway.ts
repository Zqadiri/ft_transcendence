import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UsersService } from './users/users.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface U_Status {
	clients: string[],
	status: string
}

@WebSocketGateway({
	namespace: "status",
	cors: {
		origin: '*',
	}
})
export class StatusGateway implements OnGatewayDisconnect {

	constructor(private readonly userServ: UsersService) { }
	@WebSocketServer()
	server: Server;

	private usersStatus = new Map<number, U_Status>();

	async handleDisconnect(client: any) {
		let index: number;
		for (const [key, value] of this.usersStatus)
		{
			index = value.clients.indexOf(client.id);

			if (index !== -1)
			{
				value.clients.splice(index, 1);

				if (value.clients.length === 0) {
					await this.userServ.updateStatus(key, "offline");
					this.server.emit("UserStatusChanged", { userId: key, status: "offline" });
					this.usersStatus.delete(key);
				}
				break;
			}
		}
	}

	#addNewClient(client: string, user: U_Status): boolean {
		if (!user.clients.includes(client)) {
			user.clients.push(client);
			return true;
		}
		return false;
	}

	@SubscribeMessage("updateStatus")
	async handleUpdateStatus(client: any, { userId, status }) {
		if (!userId || !status)
			return;

		let user: U_Status;

		if (!this.usersStatus.has(userId)) {
			user = {
				clients: [client.id],
				status: status
			}

			this.usersStatus.set(userId, user);
			await this.userServ.updateStatus(userId, status);
			this.server.emit("UserStatusChanged", { userId: userId, status: status });
		}
		else {
			user = this.usersStatus.get(userId);
		
			this.usersStatus.set(userId, user);
			if (this.#addNewClient(client.id, user) && user.status === "ingame")
				return ;
	
			user.status = status;
			await this.userServ.updateStatus(userId, status);
			this.server.emit("UserStatusChanged", { userId: userId, status: status });
		}
	}
}