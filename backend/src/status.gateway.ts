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
			if (this.users[property][0] === userId)
			{
				found = true;
				break ;
			}
		}
		return (found);
	}

	getUserStatus(userId: number): string
	{
		let		status: string;

		for (const property in this.users)
		{
			if (this.users[property][0] === userId)
			{
				status = this.users[property][1];
				if (status === "offline")
					delete this.users[property];
				break ;
			}
		}
		return (status);
	}

	handleDisconnect(client: any) {
		if (this.users[client.id])
		{
			const	userId: number = this.users[client.id][0];

			delete this.users[client.id];
			if (!this.hasUserid(userId))
				this.userServ.updateStatus(userId, "offline");
			else
				this.userServ.updateStatus(userId, this.getUserStatus(userId));
		}
	}

	@SubscribeMessage("userId")
	async handleUserId(client: any, userId: number)
	{
		if (userId)
		{
			if (!this.hasUserid(userId))
				this.userServ.updateStatus(userId, "online");
			this.users[client.id] = [userId, "online"];
		}
	}

	@SubscribeMessage("inGame")
	async handleInGame(client: any, {userId, status})
	{
		if (userId && this.users[client.id])
		{
			this.users[client.id][1] = status;
			this.userServ.updateStatus(Number(userId), status);
		}
	}

	@SubscribeMessage("logOut")
	handleLogOut(client: any, userId)
	{
		if (userId)
		{
			for (const property in this.users)
			{
				if (this.users[property][0] === userId)
					this.users[property][1] = "offline";
			}
			this.userServ.updateStatus(userId, "offline");
		}
	}

}
