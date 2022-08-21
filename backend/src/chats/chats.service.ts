import { Injectable, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { CreateDmDto, CreateRoomDto, RoomStatus, ChatTypes, RoomDto, SetRolestoMembersDto, RoomNamedto } from './dto/create-chat.dto';
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

    const user = await this.Userrepository.findOneBy({ username: creator });

    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${creator}' does not exist`})
    }

    const newRoom = this.Chatrepository.create({
      ownerID: user.username,
      userID: [user.username],
      AdminsID: [],
      mutedID: [],
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
      else if (name.status === RoomStatus.PROTECTED && Roomdata.password)
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
      else
        throw new UnauthorizedException({code: 'Unauthorized', message: `you have to set password to join '${roomName}'`})
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

  async RemovePasswordToRoom(RoomDto: RoomDto, owner: string)
  {
    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: RoomDto.name,
          ownerID: owner,
      },
      }).catch(() => {
        throw new UnauthorizedException({code: 'Unauthorized', message: `can not remove password to '${RoomDto.name}' chat room!!`})
      });

       await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({password: null, status: RoomStatus.PUBLIC})
          .where("ownerID = :ownerID", { ownerID: owner})
          .andWhere("name = :name", {name: RoomDto.name})
          .execute()


  }

  // display all public rooms exist in the database
  async DisplayAllPublicRooms()
  {
    const publicrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID' ,'db_chat.id'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .where("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .andWhere("db_chat.status = :status", {status: RoomStatus.PUBLIC})
    .groupBy("db_chat.id")
    .addGroupBy("db_chat.name")
    .getRawMany()

    return publicrooms;
  }

  // display all protected rooms exist in the database
  async DisplayAllProtectedRooms()
  {
    const protectedrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID' ,'db_chat.id'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .where("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .andWhere("db_chat.status = :status", {status: RoomStatus.PROTECTED})
    .groupBy("db_chat.id")
    .addGroupBy("db_chat.name")
    .getRawMany()

    return protectedrooms;
  }

  // display all my rooms exist in the database
  async DisplayAllMyRooms(username: string)
  {
    const Myrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name','db_chat.ownerID', 'db_chat.id'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .where(":username = ANY (db_chat.userID)", { username: username })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .groupBy("db_chat.id")
    .addGroupBy("db_chat.name")
    .getRawMany()


    return Myrooms;
  }

  /** The channel owner is a channel administrator. They can set other users as
    administrators. */

  async SetUserRoomAsAdmin(owner: string, SetRolestoMembersDto: SetRolestoMembersDto)
  {
    // check the user who want to join exist in table user

    const user = await this.Userrepository.findOneBy({ username: SetRolestoMembersDto.username });

    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${SetRolestoMembersDto.username}' does not exist`})
    }

    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: SetRolestoMembersDto.RoomID,
          ownerID: owner,
      },
      }).catch(() => {
        throw new BadRequestException({code: 'invalid', message: `there is no chat room with name '${SetRolestoMembersDto.RoomID}' and owner '${owner}'!!`})
      });
      console.log("user name", user.username);
      console.log("check ", check);
      console.log("ret ", check.userID.includes(user.username));

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

    private random_item(items)
    {
      
      return items[Math.floor(Math.random()*items.length)];
        
    }

    async LeaveOwnerRoom(owner: string, RoomName: string)
    {
       const isOwner = await this.Chatrepository.findOneOrFail({
        where: 
          {
              name: RoomName,
              ownerID: owner
          },
       }).catch(() => {
        throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveOwnerRoom}`})
      });

       if (isOwner)
       {
        if (isOwner.AdminsID.length)
        {
          isOwner.userID = isOwner.userID.filter(item => item !==  isOwner.ownerID);

          var randomadmin = this.random_item(isOwner.AdminsID);
          
          isOwner.AdminsID = isOwner.AdminsID.filter(item => item !== randomadmin);

          console.log("random admin ", randomadmin);

          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({ownerID: randomadmin, userID: isOwner.userID, AdminsID: isOwner.AdminsID})
          .where("name = :name", {name: RoomName})
          .execute()


          console.log("Leave the channel and give ownership to a random admin ", isOwner);

        } else if (!(isOwner.userID.length === 1))
        {
          isOwner.userID = isOwner.userID.filter(item => item !== isOwner.ownerID);

          var randomuser = this.random_item(isOwner.userID);

          const ret_query2 = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({ownerID: randomuser, userID: isOwner.userID})
          .andWhere("name = :name", {name: RoomName})
          .execute()

          console.log("Leave the channel and give ownership to a random user ");
        }
        else if (isOwner.userID.length === 1)
        {
          const delete_room = await this.Chatrepository
          .createQueryBuilder()
          .delete()
          .from(Chat)
          .andWhere("name = :name", {name: RoomName})
          .execute()
          console.log("the Room is deleted ");
        }
       }
       else
        throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveOwnerRoom}`})
    }

    /** The administrators of a channel can ban or mute users for a limited time */


  /*-------------------------------------------------------------------------- */
  

}
