import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { CreateDmDto, CreateRoomDto, RoomStatus, ChatTypes } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;

  @InjectRepository(User)
  private readonly Userrepository: Repository<User>;

  @InjectRepository(ChatLogs)
  private readonly ChatLogsrepository: Repository<ChatLogs>;


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

    const newRoom = this.Chatrepository.create({
      ownerID: creator,
      userID: [creator],
      name: room.name,
      type: ChatTypes.CHATROOM,
      status: room.status,
      password: room.password

    });
    await this.Chatrepository.save(newRoom);

    return newRoom;
  }

  /** join User to public chat room */

  async JointoChatRoom(room: CreateRoomDto, username: string)
  {
    // check if the current user already in userID array if not add it
    
    const roomName = room.name;
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (!name){
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})
    }

    // check the user who want to join exist in table user

    // const user = await this.Userrepository.findOneBy({ username: username });

    // if (!user){
    //   throw new BadRequestException({code: 'invalid username', message: `User with '${username}' does not exist`})
    // }

    // if (!name.userID.includes(user.username))
    // {
    //   name.userID.push(user.username);
    //   await this.Chatrepository.save(name);
    // }

    if (!name.userID.includes(username))
    {
      if (room.status == RoomStatus.PUBLIC)
      {
        name.userID.push(username);
        await this.Chatrepository.save(name);
      }
      else if (room.status == RoomStatus.PROTECTED)
      {
        const isMatch = await bcrypt.compare(room.password, name.password);
        if (!isMatch)
          throw new UnauthorizedException({code: 'Unauthorized', message: `Wrong password to join '${roomName}'`})
        else
        {
          name.userID.push(username);
          await this.Chatrepository.save(name);
        }
      }
    }
  }

  async getUsersFromRoom(roomName: string)
  {
    // check if the room already exist
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (!name){
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})
    }
    
    const user = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.userID']) // added selection
    .where("db_chat.name = :name", { name: roomName })
    .getOne();

    return user;
  }

  /** Change visibility */

  //     The channel owner can set a password required to access the channel, change
  //     it, and also remove it.

  async SetPasswordToRoom(room: CreateRoomDto, owner: string)
  {
    const roomName = room.name;
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (!name)
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})

    const isOwner = await this.Chatrepository.findOneBy({ ownerID: owner });
    if (name && isOwner)
    {
      if (room.status == RoomStatus.PUBLIC || room.status == RoomStatus.PRIVATE)
      {
        const hash = await bcrypt.hash(room.password, 10);
        console.log("dkhaal hnaya");
        await this.Chatrepository
            .createQueryBuilder()
            .update(Chat)
            .set({password: hash, status: room.status})
            .where("ownerID = :ownerID", { ownerID: owner})
            .execute()
        }
    }
    else
      throw new UnauthorizedException({code: 'Unauthorized', message: `can not set password to '${roomName}' chat room`})

  }


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

  /** simple real time chat functions */

  async create(chatlogsdto: ChatLogsDto, clientId: string) : Promise<ChatLogs>
  {
    // This action adds a new chat
    const msg = {
      userID: this.clientToUser[clientId],
      message: chatlogsdto.message,
    };

    return await this.ChatLogsrepository.save(msg);
    // this.messages.push(message);
    // return message;
  }

  async findAll_Dm_messages() : Promise<ChatLogs[]>
  {
    return await this.ChatLogsrepository.find();
    // This action returns all chats
   // return this.messages;
  }

}
