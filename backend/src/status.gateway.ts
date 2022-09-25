import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UsersService } from './users/users.service';

@WebSocketGateway({
	namespace: "status",
	cors: {
		origin: '*',
	}
})
export class StatusGateway implements OnGatewayDisconnect {

	constructor( private readonly userServ: UsersService ) {}

	private	users = {};

	hasUserid(userId: number): boolean
	{
		let		found: boolean = false;

		for (const property in this.users) {
			if (this.users[property] === userId)
			{
				found = true;
				break ;
			}
		}
		return (found);
	}

	handleDisconnect(client: any) {
		const	userId: number = this.users[client.id];

		delete this.users[client.id];
		if (!this.hasUserid(userId))
			this.userServ.updateStatus(userId, "offline");
	}

	@SubscribeMessage("userId")
	async handleUserId(client: any, userId: string)
	{
		if (userId)
		{
			this.users[client.id] = userId;
			if (!this.hasUserid(Number(userId)))
				this.userServ.updateStatus(Number(userId), "online");
		}
	}

	@SubscribeMessage("inGame")
	async handleInGame(client: any, {userId, status})
	{
		if (userId)
			this.userServ.updateStatus(Number(userId), status);
	}

}
