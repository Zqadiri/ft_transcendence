import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UsersService } from './users/users.service';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { ChatsService } from './chats/chats.service';

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

	@Inject(ChatsService)
	private chatsService: ChatsService;

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
	async handleUpdateStatus(
// @ConnectedSocket()
client: Socket, status: string) {
		try {
			const	userData = await this.chatsService.getUserFromSocket(client);
			let user: U_Status;

			if (!this.usersStatus.has(userData.id)) {
				user = {
					clients: [client.id],
					status: status
				}

				this.usersStatus.set(userData.id, user);
				await this.userServ.updateStatus(userData.id, status);
				this.server.emit("UserStatusChanged", { userId: userData.id, status: status });
			}
			else {
				user = this.usersStatus.get(userData.id);
			
				if (this.#addNewClient(client.id, user) && user.status === "ingame")
					return ;
		
				user.status = status;
				this.usersStatus.set(userData.id, user);
				await this.userServ.updateStatus(userData.id, status);
				this.server.emit("UserStatusChanged", { userId: userData.id, status: status });
			}
		} catch {}
	}
}