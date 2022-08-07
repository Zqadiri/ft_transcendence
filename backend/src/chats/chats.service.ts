import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateDmDto, CreateRoomDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;


  /** Create DM */

  async CreateDm(dm: CreateDmDto, userid1: number, userid2: number)
  {
    //TODO
  }

  /** Create ROOM */

  async createRoom(room: Chat)
  {
     //TODO: check if the room already exist in the database if not create a new instance of it
    const roomName = room.name;
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (name){
      throw new ConflictException({code: 'room.conflict', message: `Room with '${name}' already exists`})
    }
    console.log(` newRoom ${room.name}`);

    const newRoom = this.Chatrepository.create(room);
    await this.Chatrepository.save(newRoom);

    return newRoom;
  }

  // clientToUser = {};

  // identify(name: string, clientId: string)
  // {
  //   this.clientToUser[clientId] = name;
  //   return Object.values(this.clientToUser);
  // }

  // getClientName(clientId: string)
  // {
  //   return this.clientToUser[clientId];
  // }
  /** simple real time chat functions */

  // async create(createChatDto: CreateChatDto, clientId: string) : Promise<Dm>
  // {
  //   // This action adds a new chat
  //   const message = {
  //     sender: this.clientToUser[clientId],
  //     text: createChatDto.text,
  //   };

  //   return await this.DMrepository.save(message);
  //   // this.messages.push(message);
  //   // return message;
  // } 

  // async findAll_Dm_messages() : Promise<Dm[]>
  // {
  //   return await this.DMrepository.find();
  //   // This action returns all chats
  //  // return this.messages;
  // }

}
