import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })
export class AppGateway implements OnGatewayConnection, OnGatewayInit {

	private	userCounter: number;
	private	roomCounter: number;
	constructor() { this.userCounter = 0; this.roomCounter = 1;}

	private logger: Logger = new Logger("AppGateway");

	afterInit(server: any) {
		this.logger.log("initialization");
	}

	handleConnection(client: any, ...args: any[]) {
		this.logger.log("client: " + client.id);
	}
	@WebSocketServer()
	server: Server;

	@SubscribeMessage("joinNewRoom")
	handleJoinNewRoom(client: Socket): void {
		this.logger.log("joinNewRoom: handleJoinNewRoom");
		let roomName: string = "Room #" + this.roomCounter;

		this.userCounter++;
		client.join(roomName);
		if (this.userCounter === 2)
		{
			this.userCounter = 0;
			this.roomCounter++;
		}
		client.emit("joinedRoom", roomName);
		// return roomName;
	}

	@SubscribeMessage("chatToServer")
	handleMessage(client: Socket, message: { room: string, content: string } ): void {
		this.logger.log("Message: " + message.content);
		this.server.to(message.room).emit("chatToClient", message.content);
	}

}
