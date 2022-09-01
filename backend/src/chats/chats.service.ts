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

  async findUser(userID: number)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    return await this.Userrepository.findOneBy({ id: userID });
  }

  async findRoom(roomName: string)
  {
    return await this.Chatrepository.findOneBy({ name: roomName });
  }
  
  private checkName(name: string)
  {
    // check if room name contains only white space or is empty
    if (!name || name.trim().length === 0)
      throw new BadRequestException({code: 'invalid name', message: `Room name must not be empty`})
    return (name);
  }

  private checkPassword(password: string, status: string)
  {
    if ((status !== RoomStatus.PROTECTED) && password)
      throw new BadRequestException({code: 'invalid data', message: `you can not set password to public/private rooms`})
    if ((password === '' || password === undefined) && status === RoomStatus.PROTECTED)
      throw new BadRequestException({code: 'invalid password', message: `Room password name must not be empty`})
    return (password);
  }
  /** Create DM */

  async CreateDm(dm: CreateDmDto, userid1: number, userid2: number)
  {
    //TODO
  }

  /** Create ROOM */

  async createRoom(room: CreateRoomDto, creator: number)
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
      ownerID: user.id,
      userID: [user.id],
      AdminsID: [],
      InvitedUserID: [],
      MutedAndBannedID:[],
      name: this.checkName(room.name),
      type: ChatTypes.CHATROOM,
      status: room.status,
      password: this.checkPassword(room.password, room.status)
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
async InviteUser(owner: number, SetRolestoMembersDto: SetRolestoMembersDto)
{
  const user = await this.findUser(SetRolestoMembersDto.userID);

  if (!user){
    throw new BadRequestException({code: 'invalid username', message: `User with '${SetRolestoMembersDto.userID}' does not exist`})
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
      if (!check.InvitedUserID.includes(user.id) && check.status === RoomStatus.PRIVATE)
      {
        check.InvitedUserID.push(user.id);
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

    const user = await this.findUser(Roomdata.userID);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${Roomdata.userID}' does not exist`})
    }

    if (!name.userID.includes(user.id))
    {
      if (name.status === RoomStatus.PUBLIC)
      {
        name.userID.push(user.id);
        await this.Chatrepository.save(name);
      }
      else if (name.status === RoomStatus.PRIVATE)
      {
        if (name.InvitedUserID.includes(user.id))
        {
          name.InvitedUserID = name.InvitedUserID.filter(item => item !== user.id);

          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({InvitedUserID: name.InvitedUserID})
          .where("name = :name", {name: name.name})
          .andWhere("status = :status", {status: RoomStatus.PRIVATE})
          .execute()

          if (ret_query)
          {
            name.userID.push(user.id);
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
          name.userID.push(user.id);
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


  async SetPasswordToRoom(RoomDto: RoomDto, owner: number)
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

  async RemovePasswordToRoom(RoomName: string, owner: number)
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

  async AllRoom(id: number)
  {
    const user = this.findUser(id);
    if (!user){
      throw new BadRequestException({code: 'invalid id', message: `User with '${id}' does not exist`})
    }
    

    const allrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name','db_chat.id', 'db_chat.status'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .leftJoin(User, 'db_user', 'db_user.id = db_chat.ownerID')
    .addSelect('db_user.username', 'ownerName')
    .where("NOT (:id = ANY (db_chat.userID)) OR (:id = ANY (db_chat.InvitedUserID)) ", { id })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .groupBy("db_chat.id")
    .addGroupBy("db_user.id")
    .addGroupBy("db_chat.name")
    .getRawMany()
    return allrooms; 
  }

  // display all my rooms exist in the database
  async AllMyRooms(id: number)
  {
    const user = this.findUser(id);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${id}' does not exist`})
    }
    const Myrooms = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['db_chat.name', 'db_chat.id'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .leftJoin(User, 'db_user', 'db_user.id = db_chat.ownerID')
    .addSelect('db_user.username', 'ownerName')
    .where("(:id = ANY (db_chat.userID))", { id })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .groupBy("db_chat.id")
    .addGroupBy("db_user.id")
    .addGroupBy("db_chat.name")
    .getRawMany()

    return Myrooms;
  }

  /** The channel owner is a channel administrator. They can set other users as
    administrators. */

  async SetUserRoomAsAdmin(owner: number, SetRolestoMembersDto: SetRolestoMembersDto)
  {
    // check the user who want to join exist in table user

    const user = await this.findUser(SetRolestoMembersDto.userID);

    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${SetRolestoMembersDto.userID}' does not exist`})
    }

    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: SetRolestoMembersDto.RoomID,
          ownerID: owner,
      },
      }).catch(() => {
        throw new BadRequestException({code: 'invalid', message: `there is no chat room with name '${SetRolestoMembersDto.RoomID}' and owner '${owner}'!!`})
      });

      if (check.userID.includes(user.id))
      {
        if (!check.AdminsID || check.AdminsID.length == 0)
        {
          check.AdminsID = [user.id];
          await this.Chatrepository.save(check);
        }
        else if (!check.AdminsID.includes(user.id))
        {
          check.AdminsID.push(user.id);
          await this.Chatrepository.save(check);
        }
      }
      else
        throw new ForbiddenException({code: 'Forbidden', message: `This user '${SetRolestoMembersDto.userID}' is not in this chat room and couldn't be admin!!`})
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
              ownerID: SetRolestoMembersDto.userID
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
        if (isUserRoom.userID.includes(SetRolestoMembersDto.userID))
        {
          if (isUserRoom.AdminsID.includes(SetRolestoMembersDto.userID))
          {
            isUserRoom.AdminsID = isUserRoom.AdminsID.filter(item => item !== SetRolestoMembersDto.userID);
            console.log("Simple Admin Leaving this room");
          }
          isUserRoom.userID = isUserRoom.userID.filter(item => item !== SetRolestoMembersDto.userID);
       
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

    async BanOrMuteUser(administrator: number, BanOrMuteMembersDto: BanOrMuteMembersDto)
    {
      const user = await this.findUser(BanOrMuteMembersDto.userID);

      if (!user){
        throw new BadRequestException({code: 'invalid username', message: `User with '${BanOrMuteMembersDto.userID}' does not exist`})
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
        
        if (check && check.userID.includes(user.id) && !check.AdminsID.includes(user.id))
        {
          /** 
           * You could use Array.find() method to check if the array includes the object as 
           * "Array.includes checks for '===' in the array" which doesn't work for objects
           */

          if (!check.MutedAndBannedID.find(element => element.userID === user.id))
          {
            check.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, userID: user.id, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
            await this.Chatrepository.save(check);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `this user is already muted/banned for a specific time!!`})
            console.log("owner", administrator);
        }
        else if (checkadmin && checkadmin.userID.includes(user.id) && checkadmin.ownerID !== user.id)
        {
          if (checkadmin.AdminsID.includes(administrator))
          {
            if (!checkadmin.MutedAndBannedID.find(element => element.userID === user.id))
            {
              checkadmin.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, userID: user.id, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
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
            listMuted.push(mutedIds.MutedAndBannedID[i].userID);
        }
        else
        {
          mutedIds.MutedAndBannedID = mutedIds.MutedAndBannedID.filter(item => item.userID !== mutedIds.MutedAndBannedID[i].userID);
  
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
            listBaned.push(bannedIds.MutedAndBannedID[i].userID);
        }
        else
        {
          bannedIds.MutedAndBannedID = bannedIds.MutedAndBannedID.filter(item => item.userID !== bannedIds.MutedAndBannedID[i].userID);
  
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
