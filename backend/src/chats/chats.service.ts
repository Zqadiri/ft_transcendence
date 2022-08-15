import { Injectable, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { CreateDmDto, CreateRoomDto, RoomStatus, ChatTypes, RoomDto, SetRolestoMembersDto } from './dto/create-chat.dto';
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

  async JointoChatRoom(Roomdata: RoomDto, username: string)
  {
    // check if the current user already in userID array if not add it
    const roomName = Roomdata.name;
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const name = await this.Chatrepository.findOneBy({ name: roomName });

    if (!name){
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})
    }

    // check the user who want to join exist in table user

    const user = await this.Userrepository.findOneBy({ username: username });

    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${username}' does not exist`})
    }

    if (!name.userID.includes(user.username))
    {
      if (name.status === RoomStatus.PUBLIC || name.status === RoomStatus.PRIVATE)
      {
        name.userID.push(user.username);
        await this.Chatrepository.save(name);
      }
      else if (name.status === RoomStatus.PROTECTED)
      {
        const isMatch = await bcrypt.compare(Roomdata.password, name.password);
        if (!isMatch)
          throw new UnauthorizedException({code: 'Unauthorized', message: `Wrong password to join '${roomName}'`})
        else
        {
          name.userID.push(user.username);
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
    
    const users = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.userID']) // added selection
    .where("db_chat.name = :name", { name: roomName })
    .getOne();

    const profils = await this.Userrepository
    .createQueryBuilder("db_user")
    .where("db_user.username IN (:...users)", { users: users.userID })
    .getRawMany();
    
    return profils;
  }

  /** Change visibility */

  //     The channel owner can set a password required to access the channel, change
  //     it, and also remove it.

  async SetPasswordToRoom(RoomDto: RoomDto, owner: string)
  {
    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: RoomDto.name,
          ownerID: owner,
      },
      }).catch(() => {
        throw new UnauthorizedException({code: 'Unauthorized', message: `can not set password to '${RoomDto.name}' chat room!!`})
      });

      const hash = await bcrypt.hash(RoomDto.password, 10);
      await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({password: hash, status: RoomStatus.PROTECTED})
          .where("ownerID = :ownerID", { ownerID: owner})
          .andWhere("name = :name", {name: RoomDto.name})
          .execute()

  }

  // display all public rooms exist in the database
  async DisplayAllPublicRooms()
  {
    const publicrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID'])
    .where("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .andWhere("db_chat.status = :status", {status: RoomStatus.PUBLIC})
    .getMany();

    return publicrooms;
  }

  // display all protected rooms exist in the database
  async DisplayAllProtectedRooms()
  {
    const protectedrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID'])
    .where("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .andWhere("db_chat.status = :status", {status: RoomStatus.PROTECTED})
    .getMany();

    return protectedrooms;
  }

  // display all my rooms exist in the database
  async DisplayAllMyRooms(username: string)
  {
    const Myrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID'])
    .where(":username = ANY (db_chat.userID)", { username: username })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .getMany();

    return Myrooms;
  }

  /** The channel owner is a channel administrator. They can set other users as
    administrators. */

  async SetUserRoomAsAdmin(ownerID: string, SetRolestoMembersDto: SetRolestoMembersDto)
  {
    // check the user who want to join exist in table user

    const user = await this.Userrepository.findOneBy({ username: SetRolestoMembersDto.username });

    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${SetRolestoMembersDto.username}' does not exist`})
    }

    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: SetRolestoMembersDto.RoomID,
          ownerID: ownerID,
      },
      }).catch(() => {
        throw new BadRequestException({code: 'invalid', message: `there is no chat room with name '${SetRolestoMembersDto.RoomID}' and ownerID '${ownerID}'!!`})
      });

      if (check.userID.includes(user.username))
      {
        if (!check.AdminsID || check.AdminsID.length == 0)
        {
          check.AdminsID = [user.username];
          await this.Chatrepository.save(check);
        }
        else if (!check.AdminsID.includes(user.username))
        {
          check.AdminsID.push(user.username);
          await this.Chatrepository.save(check);
        }
      }
      else
        throw new ForbiddenException({code: 'Forbidden', message: `This user '${SetRolestoMembersDto.username}' is not in this chat room and couldn't be admin!!`})
  }
  /*-------------------------------------------------------------------------- */
  
  
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
