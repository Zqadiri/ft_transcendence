import { Inject, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/chats/chats.service';
import { UpdateGameService } from './update-game.service';

interface	MatchingData {
	clients: string[];
	usersId: number[];
	roomCounter: number;
}

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: '*',
	}
})
export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection {

	private	themeOne: MatchingData;
	private	themeTwo: MatchingData;
	
	@Inject(ChatsService)
	private chatsService: ChatsService;

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("GameGateway");

	constructor(private updateGame: UpdateGameService) {
		this.themeOne = {
			clients: [],
			usersId: [],
			roomCounter: 1
		};
		this.themeTwo = {
			clients: [],
			usersId: [],
			roomCounter: 1000000000
		};
	}

	async handleConnection(
//@ConnectedSocket()
client: Socket, ...args: any[]) {
		try {
			await this.chatsService.getUserFromSocket(client);
			this.logger.log(client.id + " Connected");
		} catch {
			this.logger.log(client.id + " was NOT Connected");
		}
	}

	handleDisconnect(client: any) {
		if (this.themeOne.clients.indexOf(client.id) !== -1 && this.themeOne.clients.length === 1)
		{
			this.themeOne.clients.pop();
			this.themeOne.usersId.pop();
		}
		else if (this.themeTwo.clients.indexOf(client.id) !== -1 && this.themeTwo.clients.length === 1)
		{
			this.themeTwo.clients.pop();
			this.themeTwo.usersId.pop();
		}
		this.updateGame.setWinnerAfterDisconnect(client.id);
		this.logger.log(client.id + " Disconnected");
	}

	#checkSecondPlayer(room: string, currentMatch: MatchingData, theme: string): boolean {
		if (currentMatch.clients.length === 2)
		{
			this.updateGame.initializeServerObject(this.server);
			this.updateGame.create(room, theme, currentMatch.clients[0], currentMatch.clients[1], currentMatch.usersId[0], currentMatch.usersId[1]);
			currentMatch.clients = [];
			currentMatch.usersId = [];
			currentMatch.roomCounter++;
			this.server.to(room).emit("secondPlayerJoined");
			return (true);
		}
		return (false);
	}

	@SubscribeMessage("joinTheme1")
	async handleJoinTheme1(
//@ConnectedSocket()
client: Socket) {
		try {
			const	user = await this.chatsService.getUserFromSocket(client);
			const	roomName = "Room #" + this.themeOne.roomCounter;
	
			if (this.themeOne.usersId.length === 1 && this.themeOne.usersId[0] === user.id)
				return;
			this.themeOne.clients.push(client.id);
			this.themeOne.usersId.push(user.id);
	
			client.join(roomName);
			client.emit("joinedRoom", roomName, this.themeOne.clients.length);
	
			if (this.#checkSecondPlayer(roomName, this.themeOne, "theme01"))
				this.themeOne.roomCounter = this.themeOne.roomCounter % 1000000000;
	
			this.logger.log(client.id + " joined Theme 1 & roomName " + roomName);
		} catch {}
	}

	@SubscribeMessage("joinTheme2")
	async handleJoinTheme2(
//@ConnectedSocket()
client: Socket) {
		try {
			const	user = await this.chatsService.getUserFromSocket(client);
			const	roomName = "Room #" + this.themeTwo.roomCounter;
	
			if (this.themeTwo.usersId.length === 1 && this.themeTwo.usersId[0] === user.id)
				return;
			this.themeTwo.clients.push(client.id);
			this.themeTwo.usersId.push(user.id);
	
			client.join(roomName);
			client.emit("joinedRoom", roomName, this.themeTwo.clients.length);
		
			if (this.#checkSecondPlayer(roomName, this.themeTwo, "theme02"))
			{
				if (this.themeTwo.roomCounter > 2000000000)
					this.themeTwo.roomCounter = 1000000000;
			}
	
			this.logger.log(client.id + " joined Theme 2 & roomName " + roomName);
		} catch {}
	}

	@SubscribeMessage("joinInvitation")
	async handleJoinInvitation(
//@ConnectedSocket()
client: Socket, {roomName, userCounter}) {
		let		clients = await this.server.in(roomName).allSockets();

		// this case is to protect the inviter disconnection before invite is accepted
		if (userCounter === 2 && clients.size === 0)
			return ;

		try {
			const	user = await this.chatsService.getUserFromSocket(client);
			const	usersId = roomName.split(":");

			if ( (clients.size === 0 && String(user.id) !== usersId[1]) || (clients.size === 1 && String(user.id) !== usersId[2]) )
				return ;

			client.join(roomName);
			client.emit("joinedRoom", roomName, userCounter);

			clients = await this.server.in(roomName).allSockets();
			
			if (clients.size === 2)
			{
				const	iter = clients.values();
			
				this.updateGame.initializeServerObject(this.server);
				this.updateGame.create(roomName, "theme01", iter.next().value, iter.next().value, usersId[1], usersId[2]);
				this.server.to(roomName).emit("secondPlayerJoined");
			}
			this.logger.log(client.id + " joined invitation & roomName " + roomName);
		}
		catch {}
	}

	@SubscribeMessage("joinSpecificRoom")
	handleJoinSpecificRoom(client: Socket, roomName: string[]): void {
		client.join(roomName);
	}

	@SubscribeMessage("gameIsStarted")
	handleGameIsStarted(client: Socket, roomName: string): void {
		this.updateGame.activateGame(roomName);
	}

	@SubscribeMessage("initializeScorePanel")
	handleInitializeScorePanel(client: Socket, roomName: string): void {
		this.updateGame.initializeScorePanel(roomName);
	}

	@SubscribeMessage("updatePaddlePosition")
	handleUpdatePaddlePosition(client: Socket, {roomName, playerId, paddleY}): void {
		this.updateGame.updatePaddlePosition(paddleY, roomName, playerId, client.id);
	}
}