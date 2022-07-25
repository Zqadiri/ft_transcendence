import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    }
  },
)
export class ChatsGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    const message = await this.chatsService.create(createChatDto);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
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

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatsService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatsService.remove(id);
  // }

 

}
