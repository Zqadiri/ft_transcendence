import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { UsersService } from 'src/users/users.service';
import { BanOrMuteMembersPlusTokenDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm/repository/Repository';


@WebSocketGateway(
	{
		namespace: '/chatNamespace'
	},
)
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@InjectRepository(Chat)
	private readonly Chatrepository: Repository<Chat>;

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('ChatsGateway');

	constructor(private readonly chatsService: ChatsService, private readonly chatLogsService: ChatLogsService,
		private readonly UsersService: UsersService) { }


	afterInit(server: Server) {
		this.logger.log('Initiaalized!');
	}

	async handleConnection(
// @ConnectedSocket()
client: Socket, ...args: any[]) {
		try{
			await this.chatsService.getUserFromSocket(client);
		}catch(e)
		{
			console.log({e})
			console.error('Failed to verify token');
		}
	}

	handleDisconnect(client: Socket) {
		// console.log(` client Disconnected: ${client.id}`);
	}

	@SubscribeMessage('saveChatRoom')
	async create(
@ConnectedSocket()
client: Socket, @MessageBody() createChatDto: ChatLogsDto) {
		try {
			// emit the message just to specific room
			const finduser = await this.chatsService.getUserFromSocket(client);
			//const finduser = await this.chatLogsService.findUserUsingID(createChatDto.userID);
			const findroom = await this.chatsService.findRoom(createChatDto.roomName);

			let user: { action: string; userID: number; current_time: number; duration: number; } | undefined;
			if (findroom) {
				user = findroom.MutedAndBannedID.find((user) => {
					return user.userID === finduser.id;
				})
			}

			if (!user) {
				createChatDto.userID = finduser.id;
				const msg = await this.chatLogsService.savechat(createChatDto);
				this.server.to(createChatDto.roomName).emit('messageToRoomSyn', { id: msg.id });
			}
		}catch (e)
		{
			console.log({d:e})
			console.error('Failed to verify token');
		}
	}

	@SubscribeMessage('getMessageToRoom')
	async handleGetMessageToRoom(
// @ConnectedSocket()
client: Socket, data: { userID: number, messageID: number }) {
		try{
			const user = await this.chatsService.getUserFromSocket(client);
			const message: ChatLogsDto = await this.chatLogsService.GetMessage(data.messageID);
			const blockedlist = await this.UsersService.blockedFriend(user.id);
			const messageSender = await this.chatLogsService.findUserUsingID(message.userID);
			const room = await this.chatsService.findRoom(message.roomName);

			if (room.userID.includes(user.id) && !blockedlist.blockedID.find(elm => elm === messageSender.id))
				client.emit('messageToRoomAck', message);
		} catch(e)
		{
			console.log({f:e})
			console.error('Failed to verify token');
		}
		
	}

	// async validateJwt(token: string) {
	// 	try {
	// 		let decoded = await this.jwtService.verifyAsync(token, { secret: String(process.env.JWT_SECRET_KEY) });
	// 		// console.log({decoded})
	// 		if (decoded)
	// 			return decoded;
	// 		return false;
	// 	} catch {
	// 		return false;
	// 	}
	// }

	// @SubscribeMessage('validateJwtSyn')
	// async checkJwt(client: Socket, token: string) {
	// 	client.emit('validateJwtAck', await this.validateJwt(token));
	// }

	@SubscribeMessage('socketJoinRoom')
	async handleJoinRoom(
//@ConnectedSocket()
client: Socket, roomName: string) {
		try {
			const user = await this.chatsService.getUserFromSocket(client);
			const room = await this.chatsService.findRoom(roomName);
			if (room.userID.includes(user.id)) {
				client.join(roomName);
				//emit to specific client
				client.emit('joinedRoom', roomName);
			}
		} catch {}
	}


	@SubscribeMessage('socketleaveRoom')
	async handleLeaveRoom(
//@ConnectedSocket()
client: Socket, roomName: string) {
		try {
			const user = await this.chatsService.getUserFromSocket(client);
			const room = await this.chatsService.findRoom(roomName);
			if (room.userID.includes(user.id)) {
				client.leave(roomName);
				client.emit('leftRoom', roomName);
			}
		} catch { }
	}

	@SubscribeMessage('GetRoomMessages')
	async displayRoomMessages(
// @ConnectedSocket()
client: Socket, roomName: string) {
		try {
			const user = await this.chatsService.getUserFromSocket(client);
			const messages = await this.chatLogsService.DisplayRoomMessages(roomName);
			const blockedlist = await this.UsersService.blockedFriend(user.id);
			const room = await this.chatsService.findRoom(roomName);
			if (room.userID.includes(user.id) && !blockedlist.blockedID.find(elm => elm === user.id))
				client.emit("RoomMessages", messages);
		} catch {}
	}

	@SubscribeMessage('SocketMuteUser')
	async Mute(
@ConnectedSocket()
client: Socket, @MessageBody() setRolesDto: BanOrMuteMembersPlusTokenDto) {

		try {
			const user = await this.chatsService.getUserFromSocket(client);
			const room = await this.chatsService.findRoom(setRolesDto.RoomID);

			if (room.AdminsID.includes(user.id) || room.ownerID == user.id) {
				console.log("is in here?")
				console.log({setroles: setRolesDto})
				this.server.to(setRolesDto.RoomID).emit('Muted', setRolesDto);
			}
			console.log("test test")
		} catch (e) {
			console.error('Failed to mute this user in this chat room', e);
			throw e;
		}
	}

	/*
		Sesco Wrote This :)
	*/
	@SubscribeMessage('inviteToGame')
	async	handleInviteToGame(
// @ConnectedSocket()
client: Socket, {friendId, roomName} : {friendId: number, roomName: string}) {
		try {
			const user = await this.chatsService.getUserFromSocket(client);
			const rooms: Chat[] = await this.chatsService.AllUserRoom(user.id);
			console.log({"user.id": user.id})
			console.log({rooms, friendId})
			if (rooms.some((room) => { return room.userID.includes(friendId); })) {
				this.server.emit(String(friendId), roomName);
			}
		} catch {}
	}
	@SubscribeMessage('invitationDeclined')
	async	handleInvitationDeclined(
//@ConnectedSocket()
client: Socket, friendId: number) {
		try {
			const user = await this.chatsService.getUserFromSocket(client);

			this.server.emit(String(friendId)+"declined");
			this.server.emit(String(user.id)+"declinedd");
		}
		catch {}
	}
	
}
