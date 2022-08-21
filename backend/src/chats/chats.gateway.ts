import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { Bind, Logger } from '@nestjs/common';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { CreateRoomDto } from './dto/create-chat.dto';

@WebSocketGateway(
  {
    namespace: '/chatNamespace'
  },
  
)
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection,  OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');

  constructor(private readonly chatsService: ChatsService, private readonly chatLogsService: ChatLogsService) {}


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
  async create(client: Socket, @MessageBody() createChatDto: ChatLogsDto) {

    await this.chatLogsService.savechat(createChatDto);
    // emit the message just to specific room
    this.server.to(createChatDto.roomName).emit('chatToClient', createChatDto);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomName:string)
  {
    client.join(roomName);
    //emit to specific client
    client.emit('joinedRoom', roomName);
  }


  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName:string)
  {
    client.leave(roomName);
    client.emit('leftRoom', roomName);
  }

  @SubscribeMessage('RoomMessages')
  async displayRoomMessages(client: Socket, roomName:string) {
   const messages = await this.chatLogsService.DisplayRoomMessages(roomName);
   console.log("messages", messages);
    return messages;
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
