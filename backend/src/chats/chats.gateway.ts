import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { Bind, Logger, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto, RoomDto, SetRolestoMembersDto, RoomNamedto, CreateDmDto, BanOrMuteMembersDto, BanOrMuteMembersPlusTokenDto, RoomStatus } from './dto/create-chat.dto';
import { Transform } from 'class-transformer';
import e, { request } from 'express';
import { find } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm/repository/Repository';
import { JwtService } from '@nestjs/jwt';


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
		private readonly UsersService: UsersService, private readonly jwtService: JwtService) { }


	afterInit(server: Server) {
		this.logger.log('Initiaalized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(` client Connected ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(` client Disconnected: ${client.id}`);
	}

	@SubscribeMessage('saveChatRoom')
	async create(@ConnectedSocket() client: Socket, @MessageBody() createChatDto: ChatLogsDto) {

		// emit the message just to specific roomz
		const finduser = await this.chatLogsService.findUserUsingID(createChatDto.userID);
		const findroom = await this.chatsService.findRoom(createChatDto.roomName);

		let user: { action: string; userID: number; current_time: number; duration: number; } | undefined;
		if (findroom) {
			user = findroom.MutedAndBannedID.find((user) => {
				return user.userID === finduser.id;
			})
		}

		if (!user) {
			createChatDto.username = finduser.username;
			const msg = await this.chatLogsService.savechat(createChatDto);
			this.server.to(createChatDto.roomName).emit('messageToRoomSyn', { id: msg.id });
		}

	}

	@SubscribeMessage('getMessageToRoom')
	async handleGetMessageToRoom(client: Socket, data: { userID: number, messageID: number }) {
		const message = await this.chatLogsService.GetMessage(data.messageID);
		const blockedlist = await this.UsersService.blockedFriend(data.userID);
		const user = await this.chatLogsService.findUserUsingID(message.userID);

		if (!blockedlist.blockedID.find(elm => elm === user.id))
			client.emit('messageToRoomAck', message);
	}

	async validateJwt(token: string) {
		try {
			let decoded = await this.jwtService.verifyAsync(token, { secret: String(process.env.JWT_SECRET_KEY) });
			// console.log({decoded})
			if (decoded)
				return decoded;
			return false;
		} catch {
			return false;
		}
	}

	@SubscribeMessage('validateJwtSyn')
	async checkJwt(client: Socket, token: string) {
		client.emit('validateJwtAck', await this.validateJwt(token));
	}

	@SubscribeMessage('socketJoinRoom')
	async handleJoinRoom(client: Socket, roomName: string) {
		client.join(roomName);
		//emit to specific client
		client.emit('joinedRoom', roomName);
	}

	// @SubscribeMessage('socketJoinDM')
	// async handleJoinDM(client: Socket, CreateDmDto: CreateDmDto)
	// {
	//   // let id : string;

	//   // console.log("parse(client.handshake.headers.cookie)", parse(client.handshake.headers.cookie).id);
	//   // const dm = await this.chatsService.CreateDm(CreateDmDto, +id);

	//   client.join(dm.name);
	//   //emit to specific client
	//   client.emit('joinedDm', dm.name);
	// }

	@SubscribeMessage('socketleaveRoom')
	async handleLeaveRoom(@ConnectedSocket() client: Socket, roomName: string) {
		client.leave(roomName);
		client.emit('leftRoom', roomName);
	}

	@SubscribeMessage('GetRoomMessages')
	async displayRoomMessages(client: Socket, roomName: string) {
		const messages = await this.chatLogsService.DisplayRoomMessages(roomName);
		console.log("messages", messages);
		client.emit("RoomMessages", messages);
		// return messages;
	}

	@SubscribeMessage('SocketMuteUser')
	async Mute(client: Socket, @MessageBody() setRolesDto: BanOrMuteMembersPlusTokenDto) {

		try {
			this.server.to(setRolesDto.RoomID).emit('Muted', setRolesDto);
		} catch (e) {
			console.error('Failed to mute this user in this chat room', e);
			throw e;
		}

	}


	/*
		Sesco Wrote This :)
	*/
	@SubscribeMessage('inviteToGame')
	handleInviteToGame(client: Socket, {friendId, roomName}) {
		this.server.emit(String(friendId), roomName);
	}
	@SubscribeMessage('invitationDeclined')
	handleInvitationDeclined(client: Socket, friendId) {
		this.server.emit(String(friendId)+"declined")
	}


   // identify the user who join the chat
  
  //  @SubscribeMessage('join') // listinig to an event named join
  //   joinRoom(
  //     @MessageBody('userID') userID: string,
  //     @ConnectedSocket() client: Socket)
  //   {
  //     const username = this.chatsService.identify(userID, client.id);
  //     return username;
  //   }

  //  //type a message and informe other users who is typing
  //   @SubscribeMessage('typing') 
  //   async typing(
  //     @MessageBody('isTyping') isTyping: string,
  //     @ConnectedSocket() client: Socket)
  //     {
  //       const name = await this.chatsService.getClientName(client.id);
  //       client.broadcast.emit('typing', {name, isTyping});
  //     }

}
