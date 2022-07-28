import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly repository: Repository<Chat>;

  // array of messages just for test chat
  // initialize it with dumy object that represent an existing message 
  messages : Message[] = [{ name : 'chicky', text: 'hey' }];
  clientToUser = {};

  identify(name: string, clientId: string)
  {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string)
  {
    return this.clientToUser[clientId];
  }
  
  create(createChatDto: CreateChatDto, clientId: string) {
    // This action adds a new chat
    const message = {
      name: this.clientToUser[clientId],
      text: createChatDto.text,
    };
    this.messages.push(message);
    return message;
  } 

  findAll() {
    // This action returns all chats
    return this.messages;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }
}
