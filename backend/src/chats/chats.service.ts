import { Injectable, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository, createQueryBuilder, In } from 'typeorm';
import { CreateDmDto, CreateRoomDto, RoomStatus, ChatTypes, RoomDto, SetRolestoMembersDto, BanOrMuteMembersDto, RoomNamedto, Action } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
import { FriendsService } from 'src/friends/friends.service';


// import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;

  @InjectRepository(User)
  private readonly Userrepository: Repository<User>;

  private readonly logger = new Logger(ChatsService.name);

  constructor(private readonly friendsService : FriendsService) {}

  async findUser(username: string)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    return await this.Userrepository.findOneBy({ username: username });
  }

  async findRoom(roomName: string)
  {
    return await this.Chatrepository.findOneBy({ name: roomName });
  }
  
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
    
    const name = await this.findRoom(roomName);
    if (name){
      throw new ConflictException({code: 'room.conflict', message: `Room with '${roomName}' already exists`})
    }

    const user = await this.findUser(creator);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${creator}' does not exist`})
    }

    const newRoom = this.Chatrepository.create({
      ownerID: user.username,
      userID: [user.username],
      AdminsID: [],
	  InvitedUserID: [],
      MutedAndBannedID:[],
      name: room.name,
      type: ChatTypes.CHATROOM,
      status: room.status,
      password: room.password

    });

    await this.Chatrepository.save(newRoom);

    return newRoom;
  }

async isFriend(owner: any, username: any)
{
  const isfrirnd = await this.friendsService.isFollowing({FirstUser: owner, SecondUser: username, isFriend: false, blocked: false});
  console.log(`Rela Exists: ${JSON.stringify(isfrirnd)}`);
  if (!isfrirnd)
    throw new UnauthorizedException('this user is not my friend');
  return (true);
}

/** invite user to join private chat room */
async InviteUser(owner: string, SetRolestoMembersDto: SetRolestoMembersDto)
{
  const user = await this.findUser(SetRolestoMembersDto.username);

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

    const isfriend = this.isFriend(check.ownerID, user.username);
    
    if (isfriend)
    {
      if (!check.InvitedUserID.includes(user.username) && check.status === RoomStatus.PRIVATE)
      {
        check.InvitedUserID.push(user.username);
        await this.Chatrepository.save(check);
      }
    }
    else
      throw new ForbiddenException({code: 'Forbidden', message: `Failed to invite this user to this chat room!!`})
}

  /** join User to public chat room */

  async JointoChatRoom(Roomdata: RoomDto)
  {
    // check if the current user already in userID array if not add it
    
    const roomName = Roomdata.name;

    const name = await this.findRoom(roomName);
    if (!name){
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})
    }

    // check the user who want to join exist in table user

    const user = await this.findUser(Roomdata.username);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${Roomdata.username}' does not exist`})
    }

    if (!name.userID.includes(user.username))
    {
      if (name.status === RoomStatus.PUBLIC)
      {
        name.userID.push(user.username);
        await this.Chatrepository.save(name);
      }
      else if (name.status === RoomStatus.PRIVATE)
      {
        if (name.InvitedUserID.includes(user.username))
        {
          name.InvitedUserID = name.InvitedUserID.filter(item => item !== user.username);

          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({InvitedUserID: name.InvitedUserID})
          .where("name = :name", {name: name.name})
          .andWhere("status = :status", {status: RoomStatus.PRIVATE})
          .execute()

          if (ret_query)
          {
            name.userID.push(user.username);
            await this.Chatrepository.save(name);
          }
        }
        else
          throw new UnauthorizedException({code: 'Unauthorized', message: `can not join this private rooom '${roomName}'`})
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
    const name = await this.findRoom(roomName);

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
    await this.Chatrepository.findOneOrFail({
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

  async RemovePasswordToRoom(RoomName: string, owner: string)
  {
    await this.Chatrepository.findOneOrFail({
      where: {
          name: RoomName,
          ownerID: owner,
      },
      }).catch(() => {
        throw new UnauthorizedException({code: 'Unauthorized', message: `can not remove password to '${RoomName}' chat room!!`})
      });

      await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({password: null, status: RoomStatus.PUBLIC})
          .where("ownerID = :ownerID", { ownerID: owner})
          .andWhere("name = :name", {name: RoomName})
          .execute()


  }

  async AllRoom(username: string)
  {
    const user = this.findUser(username);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${username}' does not exist`})
    }
    const allrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.ownerID' ,'db_chat.id', 'db_chat.status'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .where("NOT (:username = ANY (db_chat.userID)) OR (:username = ANY (db_chat.InvitedUserID)) ", { username: username })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .groupBy("db_chat.id")
    .addGroupBy("db_chat.name")
    .getRawMany()

    return allrooms; 
  }

  // display all my rooms exist in the database
  async AllMyRooms(username: string)
  {
    const user = this.findUser(username);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${username}' does not exist`})
    }
    const Myrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name','db_chat.ownerID', 'db_chat.id'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .where("(:username = ANY (db_chat.userID))", { username: username })
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

    const user = await this.findUser(SetRolestoMembersDto.username);

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

    async LeaveRoom(SetRolestoMembersDto: SetRolestoMembersDto)
    {
      const isOwner = await this.Chatrepository.findOne({
        where: 
          {
              name: SetRolestoMembersDto.RoomID,
              ownerID: SetRolestoMembersDto.username
          },
      });

      const isUserRoom = await this.findRoom(SetRolestoMembersDto.RoomID);
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
          .where("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()


          console.log("Leave the channel and give ownership to a random admin ", isOwner);

        }
        else if (!(isOwner.userID.length === 1))
        {
          isOwner.userID = isOwner.userID.filter(item => item !== isOwner.ownerID);

          var randomuser = this.random_item(isOwner.userID);

          const ret_query2 = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({ownerID: randomuser, userID: isOwner.userID})
          .andWhere("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()

          console.log("Leave the channel and give ownership to a random user ");
        }
        else if (isOwner.userID.length === 1)
        {
          const delete_room = await this.Chatrepository
          .createQueryBuilder()
          .delete()
          .from(Chat)
          .andWhere("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()
          console.log("the Room is deleted ");
        }
      }
      else if (isUserRoom)
      {
        if (isUserRoom.userID.includes(SetRolestoMembersDto.username))
        {
          if (isUserRoom.AdminsID.includes(SetRolestoMembersDto.username))
          {
            isUserRoom.AdminsID = isUserRoom.AdminsID.filter(item => item !== SetRolestoMembersDto.username);
            console.log("Simple Admin Leaving this room");
          }
          isUserRoom.userID = isUserRoom.userID.filter(item => item !== SetRolestoMembersDto.username);
       
          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({userID: isUserRoom.userID, AdminsID: isUserRoom.AdminsID})
          .where("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()
          console.log("Simple user Leaving this room", isUserRoom);
        }
        else
          throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveUserRoom}`})
      }
      else
        throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveOwnerRoom}`})
    }

    /** The administrators of a channel can ban or mute users for a limited time */

    async BanOrMuteUser(administrator: string, BanOrMuteMembersDto: BanOrMuteMembersDto)
    {
      const user = await this.findUser(BanOrMuteMembersDto.username);

      if (!user){
        throw new BadRequestException({code: 'invalid username', message: `User with '${BanOrMuteMembersDto.username}' does not exist`})
      }

      const check = await this.Chatrepository.findOne({
        where: {
            name: BanOrMuteMembersDto.RoomID,
            ownerID: administrator,
          },
        });

      const checkadmin = await this.Chatrepository.findOne({
        where: {
            name: BanOrMuteMembersDto.RoomID
          },
        });
        
        if (check && check.userID.includes(user.username) && !check.AdminsID.includes(user.username))
        {
          /** 
           * You could use Array.find() method to check if the array includes the object as 
           * "Array.includes checks for '===' in the array" which doesn't work for objects
           */

          if (!check.MutedAndBannedID.find(element => element.username === user.username))
          {
            check.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, username: user.username, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
            await this.Chatrepository.save(check);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `this user is already muted/banned for a specific time!!`})
            console.log("owner", administrator);
        }
        else if (checkadmin && checkadmin.userID.includes(user.username) && checkadmin.ownerID !== user.username)
        {
          if (checkadmin.AdminsID.includes(administrator))
          {
            if (!checkadmin.MutedAndBannedID.find(element => element.username === user.username))
            {
              checkadmin.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, username: user.username, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
              await this.Chatrepository.save(checkadmin);
            }
            else
              throw new ForbiddenException({code: 'Forbidden', message: `this user is already muted/banned for a specific time!!`})
        
            console.log("administrator", administrator);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `you can't mute/ban this user in this chat room!!`})
        }
        else
          throw new ForbiddenException({code: 'Forbidden', message: `Failed to mute/ban this user in this chat room!!`})
    }
    // @Cron(CronExpression.EVERY_30_SECONDS)
    // handleCron() {
    //   this.logger.debug('Called every 30 seconds');
    // }

    async ListMutedID(roomName: string)
    {
      this.logger.debug('Called every 30 seconds !!');
      const listMuted = [];
      
      const mutedIds = await this.Chatrepository
      .createQueryBuilder("db_chat")
      .select(['db_chat.MutedAndBannedID']) // added selection
      .where("db_chat.name = :name", { name: roomName })
      .getOne();

      //if ( mutedIds.MutedAndBannedID)
       // this.handleCron();
      for (let i = 0; i < mutedIds.MutedAndBannedID.length; i++)
      {
        if ((mutedIds.MutedAndBannedID[i].current_time + mutedIds.MutedAndBannedID[i].duration * 1000 ) > Date.now())
        {
          if (mutedIds.MutedAndBannedID[i].action === Action.MUTE)
            listMuted.push(mutedIds.MutedAndBannedID[i].username);
        }
        else
        {
          mutedIds.MutedAndBannedID = mutedIds.MutedAndBannedID.filter(item => item.username !== mutedIds.MutedAndBannedID[i].username);
  
            console.log("filter user, from mutedID array ",mutedIds.MutedAndBannedID);
  
            const ret_query = await this.Chatrepository
            .createQueryBuilder()
            .update(Chat)
            .set({MutedAndBannedID: mutedIds.MutedAndBannedID})
            .where("name = :name", { name: roomName})
            .execute()
        }
      }
      return listMuted;
    }

    async ListBannedID(roomName: string)
    {
      this.logger.debug('Called every 30 seconds !');
      const listBaned = [];
      
      const bannedIds = await this.Chatrepository
      .createQueryBuilder("db_chat")
      .select(['db_chat.MutedAndBannedID']) // added selection
      .where("db_chat.name = :name", { name: roomName })
      .getOne();

     // if (bannedIds.MutedAndBannedID)
       // this.handleCron();

      for (let i = 0; i < bannedIds.MutedAndBannedID.length; i++)
      {
        if ((bannedIds.MutedAndBannedID[i].current_time + bannedIds.MutedAndBannedID[i].duration * 1000 ) > Date.now())
        {
          if (bannedIds.MutedAndBannedID[i].action === Action.BAN)
            listBaned.push(bannedIds.MutedAndBannedID[i].username);
        }
        else
        {
          bannedIds.MutedAndBannedID = bannedIds.MutedAndBannedID.filter(item => item.username !== bannedIds.MutedAndBannedID[i].username);
  
            console.log("filter user, from bannedID array ",bannedIds.MutedAndBannedID);
  
            const ret_query = await this.Chatrepository
            .createQueryBuilder()
            .update(Chat)
            .set({MutedAndBannedID: bannedIds.MutedAndBannedID})
            .where("name = :name", { name: roomName})
            .execute()
        }
      }
      return listBaned;
    }

  /*-------------------------------------------------------------------------- */
  

}
