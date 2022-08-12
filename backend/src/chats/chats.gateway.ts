import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { Bind, Logger } from '@nestjs/common';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';

@WebSocketGateway(
  {
    namespace: '/chatNamespace'
  },
  
)
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection,  OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');

  constructor(private readonly chatsService: ChatsService) {}


  afterInit(server: Server) {
    this.logger.log('Initiaalized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(` client Connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(` client Disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: {sender: string, room: string, message: string})
  {
    // emit the message just to specific room
    this.server.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room:string)
  {
    client.join(room);
    //emit to specific client
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room:string)
  {
    client.leave(room);
    client.emit('leftRoom', room);
  }
//   @SubscribeMessage('createChat')
//   async create(
//     @MessageBody() createChatDto: ChatLogsDto,
//     @ConnectedSocket() client: Socket) {
//     const message = await this.chatsService.create(createChatDto, client.id);
//     client.emit('message', message);
//     client.broadcast.emit('message', message);
//     return message;
//   }

//   @SubscribeMessage('findAllChats')
//   async findAll() {
//     return this.chatsService.findAll_Dm_messages();
//   }

//    // identify the user who join the chat
  
//    @SubscribeMessage('join') // listinig to an event named join
//     joinRoom(
//       @MessageBody('userID') userID: string,
//       @ConnectedSocket() client: Socket)
//     {
//       const username = this.chatsService.identify(userID, client.id);
//       return username;
//     }

//    //type a message and informe other users who is typing
//     @SubscribeMessage('typing') 
//     async typing(
//       @MessageBody('isTyping') isTyping: string,
//       @ConnectedSocket() client: Socket)
//       {
//         const name = await this.chatsService.getClientName(client.id);
//         client.broadcast.emit('typing', {name, isTyping});
//       }
 }
