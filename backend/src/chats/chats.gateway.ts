import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { Bind, Logger } from '@nestjs/common';
import { Dm } from './entities/dm.entitiy';

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    }
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

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket) {
    const message = await this.chatsService.create(createChatDto, client.id);
    client.emit('message', message);
    client.broadcast.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllChats')
  async findAll() {
    return this.chatsService.findAll_Dm_messages();
  }

   // identify the user who join the chat
   @SubscribeMessage('join') // listinig to an event named join
    joinRoom(
      @MessageBody('name') name: string,
      @ConnectedSocket() client: Socket)
    {
      return this.chatsService.identify(name, client.id);
    }

   //type a message and informe other users who is typing
    @SubscribeMessage('typing') 
    async typing(
      @MessageBody('isTyping') isTyping: string,
      @ConnectedSocket() client: Socket)
      {
        const name = await this.chatsService.getClientName(client.id);
        client.broadcast.emit('typing', {name, isTyping});
      }
}
