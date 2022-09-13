import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameData } from "./game.interface"
import { UpdateGameService } from './update-game.service';

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: '*',
	}
})
export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection {

	private	themeOneUsers: string[] = [];
	private	roomCounter1: number;
	private	themeTwoUsers: string[] = [];
	private	roomCounter2: number;

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("GameGateway");

	constructor(private updateGame: UpdateGameService) {
		this.roomCounter1 = 1;
		this.roomCounter2 = 1000000000;
	}

	handleConnection(client: any, ...args: any[]) {
		this.logger.log(client.id + " Connected");
	}
	handleDisconnect(client: any) {

		let		index1: number = this.themeOneUsers.indexOf(client.id);
		let		index2: number = this.themeTwoUsers.indexOf(client.id);

		if (this.themeOneUsers.length === 1 && index1 !== -1)
			this.themeOneUsers.splice(index1, 1);
		else if (this.themeTwoUsers.length === 1 && index2 !== -1)
			this.themeTwoUsers.splice(index1, 1);
		
		this.updateGame.OnePlayerDisconnect(client.id);
		this.logger.log(client.id + " Disconnected");
	}

	@SubscribeMessage("joinTheme1")
	handleJoinTheme1(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter1;

		this.themeOneUsers.push(client.id);
		client.join(roomName);
		client.emit("joinedRoom", roomName, this.themeOneUsers.length);
		if (this.themeOneUsers.length === 2)
		{
			this.roomCounter1 = (this.roomCounter1 + 1) % 1000000000;
			this.updateGame.create(roomName, "theme01", this.themeOneUsers[0], this.themeOneUsers[1]);
			this.themeOneUsers.splice(0, 2);
			this.server.to(roomName).emit("secondPlayerJoined");
		}
		this.logger.log(client.id + " joined Theme 1 & roomName " + roomName);
	}

	@SubscribeMessage("joinTheme2")
	handleJoinTheme2(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter2;

		this.themeTwoUsers.push(client.id);
		client.join(roomName);
		client.emit("joinedRoom", roomName, this.themeTwoUsers.length);
		if (this.themeTwoUsers.length === 2)
		{
			this.roomCounter2++;
			if (this.roomCounter2 > 2000000000)
				this.roomCounter2 = 1000000000;
			this.updateGame.create(roomName, "theme02", this.themeTwoUsers[0], this.themeTwoUsers[1]);
			this.themeTwoUsers.splice(0, 2);
			this.server.to(roomName).emit("secondPlayerJoined");
		}
		this.logger.log(client.id + " joined Theme 2 & roomName " + roomName);
	}
	@SubscribeMessage("joinLiveGame")
	handleJoinLiveGame(client: Socket, roomName: string): void {
		client.emit("joinedRoom", roomName, 3);
		client.join(roomName);
		this.server.to(roomName).emit("secondPlayerJoined");
	}

	@SubscribeMessage("cancelRoom")
	handleCancelRoom(client: Socket, {roomName, theme}): void {
		this.logger.log("Cancel Event is fired " + roomName + " " + theme + " " + this.themeOneUsers);
		if (theme === "theme1")
		{
			this.themeOneUsers.pop();
			this.logger.log(this.themeOneUsers);
		}
		else
			this.themeTwoUsers.pop();
		client.leave(roomName);
	}

	@SubscribeMessage("leaveRoom")
	handleLeaveRoom(client: Socket, room: string): void {
		client.leave(room);
		// this.updateGame.delete(room);
	}

	@SubscribeMessage("gameIsStarted")
	handleExchangeData(client: Socket, roomName: string): void {
		this.updateGame.initializeServerObject(this.server);
		this.updateGame.sendDataToFrontend(roomName);
	}

	@SubscribeMessage("updatePaddlePosition")
	handleUpdatePaddlePosition(client: Socket, {roomName, playerId, y}): void {
		this.updateGame.updatePaddlePosition(y, roomName, playerId);
	}
}