import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameData } from "./game.interface"
import { UpdateGameService } from './update-game.service';

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: '*',
	}
})
export class GameGateway {

	private	userCounter1: number;
	private	roomCounter1: number;
	private	userCounter2: number;
	private	roomCounter2: number;
	constructor(private updateGame: UpdateGameService) { this.userCounter1 = 0; this.roomCounter1 = 1; this.userCounter2 = 0; this.roomCounter2 = 1000000000;}

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("GameGateway");

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}

	@SubscribeMessage("joinTheme1")
	handleJoinTheme1(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter1;

		this.userCounter1++;
		client.join(roomName);
		client.emit("joinedRoom", roomName, this.userCounter1);
		if (this.userCounter1 === 2)
		{
			this.userCounter1 = 0;
			this.roomCounter1 = (this.roomCounter1 + 1) % 1000000000;
			this.updateGame.create(roomName);
			this.server.to(roomName).emit("secondPlayerJoined");
		}
		this.logger.log(client.id + " joined Theme 1");
	}

	@SubscribeMessage("joinTheme2")
	handleJoinTheme2(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter2;

		this.userCounter2++;
		client.join(roomName);
		client.emit("joinedRoom", roomName, this.userCounter2);
		if (this.userCounter2 === 2)
		{
			this.userCounter2 = 0;
			this.roomCounter2++;
			if (this.roomCounter2 > 2000000000)
				this.roomCounter2 = 1000000000;
			this.updateGame.create(roomName);
			this.server.to(roomName).emit("secondPlayerJoined");
		}
		this.logger.log(client.id + " joined Theme 2");
	}

	@SubscribeMessage("cancelRoom")
	handleCancelRoom(client: Socket, {roomName, theme}): void {
		if (theme === "theme1")
			this.userCounter1--;
		else
			this.userCounter2--;
		client.leave(roomName);
	}

	@SubscribeMessage("leaveRoom")
	handleLeaveRoom(client: Socket, room: string): void {
		client.leave(room);
	}

	@SubscribeMessage("exchangeData")
	handleExchangeData(client: Socket, {roomName, gameCoordinates}): void {
		gameCoordinates = this.updateGame.update(gameCoordinates, roomName);
		let	winner = this.updateGame.check_for_the_winner(gameCoordinates.p1.score, gameCoordinates.p2.score);
		this.server.to(roomName).emit("newCoordinates", gameCoordinates);
		if (winner !== 0)
		{
			this.server.to(roomName).emit("theWinner", winner);
			this.updateGame.delete(roomName);
		}
	}

	@SubscribeMessage("sendSecondPlayerY")
	handleSendUser2Y(client: Socket, {roomName, y}): void {
		this.updateGame.setY(roomName, y);

	}
}