import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateDmDto, CreateRoomDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;

  users : string[] = [];
  admins : string[] = [];

  /** Create DM */

  async CreateDm(dm: CreateDmDto, userid1: number, userid2: number)
  {
    //TODO
  }

  /** Create ROOM */

  async createRoom(room: CreateRoomDto, creator: string)
  {
     //TODO: check if the room already exist in the database if not create a new instance of it
    const roomName = room.name;
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (name){
      throw new ConflictException({code: 'room.conflict', message: `Room with '${roomName}' already exists`})
    }
    this.users.push(creator);
    this.admins.push(creator);
    const newRoom = this.Chatrepository.create({
      ownerID: creator,
      userID: this.users,
      AdminsID: this.admins,
      name: room.name,
      type: room.type,
      status: room.status,
      password: room.password

    });
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
