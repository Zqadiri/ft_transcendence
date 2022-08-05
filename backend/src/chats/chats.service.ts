import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Dm } from './entities/dm.entitiy';
import { User } from 'src/users/user.entity';

@Injectable()
export class ChatsService {

  @InjectRepository(Dm)
  private readonly DMrepository: Repository<Dm>;
  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;
  @InjectRepository(Message)
  private readonly Messagerepository: Repository<Message>;


  // array of messages just for test chat
  // initialize it with dumy object that represent an existing message 

  // messages : Message[] = [{ name : 'chicky', text: 'hey' }];

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
  
  async create(createChatDto: CreateChatDto, clientId: string) : Promise<Dm>
  {
    // This action adds a new chat
    const message = {
      sender: this.clientToUser[clientId],
      text: createChatDto.text,
    };

    return await this.DMrepository.save(message);
    // this.messages.push(message);
    // return message;
  } 

  async findAll_Dm_messages() : Promise<Dm[]>
  {
    return await this.DMrepository.find();
    // This action returns all chats
   // return this.messages;
  }

  /*********   Room functions *********************/
              /** TODO:*/




}
