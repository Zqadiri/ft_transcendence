import { Injectable, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateDmDto, CreateRoomDto, RoomStatus, ChatTypes, RoomDto, SetRolestoMembersDto, BanOrMuteMembersDto, Action, RoomWoUserDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';


@Injectable()
export class ChatsService {

  @InjectRepository(Chat)
  private readonly Chatrepository: Repository<Chat>;

  @InjectRepository(User)
  private readonly Userrepository: Repository<User>;

  @InjectRepository(ChatLogs)
  private readonly ChatLogsrepository: Repository<ChatLogs>;

  private readonly logger = new Logger(ChatsService.name);

  constructor(private readonly jwtService: JwtService) { }


  /** Get the authentication token from the cookies*/

  async getUserFromAuthenticationToken(token: string) {
		try
		{	
			const payload = await this.jwtService.verify(token, { secret: String(process.env.JWT_SECRET_KEY) });

			if (payload.id){
      		return this.findUser(payload.id);
			}
		}catch(e)
		{

		}
	

  }

	async getUserFromSocket(socket: Socket) {
		const authenticationToken = socket.handshake.auth.token;
		// const { Authentication: authenticationToken } = parse(cookie);
		if (authenticationToken) {
			const user = await this.getUserFromAuthenticationToken(authenticationToken);

			if (!user) {
				socket.emit("validateJwtAck", 0);
				throw new WsException('Invalid credentials.');
			}
			return user;
		}
	}

  /** ----------------------------------------------------- */
  
  async findUser(userID: number)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    return await this.Userrepository.findOneBy({ id: userID });
  }

  async findRoom(roomName: string)
  {
    return await this.Chatrepository.findOneBy({ name: roomName });
  }

  async findRoomWithId(roomId: number)
  {
    return await this.Chatrepository.findOneBy({ id: roomId });
  }
  
  async checkRoomOwner(RoomName: string, owner: number)
  {
    const check = await this.Chatrepository.findOneOrFail({
      where: {
          name: RoomName,
          ownerID: owner,
      },
      }).catch(() => {
        throw new BadRequestException({code: 'invalid', message: `there is no chat room with name '${RoomName}' and owner '${owner}'!!`})
      });
      return (check);
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

  async checkIfDmExisted(userid1: number, userid2: number)
  {
    const ret = await this.Chatrepository
    .createQueryBuilder()
    .where('type=:type', { type: ChatTypes.DM })
    .andWhere('name=:name or name=:name2', {
      name: `${userid1},${userid2}`,
      name2: `${userid2},${userid1}`,
    })
    .getMany();

    return (ret);
  }

  async CreateDm(dm: CreateDmDto)
  {
    //TODO
    const userid2 = dm.userID2;
    const user1 = await this.findUser(dm.userID1);
    if (!user1){
      throw new BadRequestException({code: 'invalid id', message: `User with '${dm.userID1}' does not exist`})
    }

    const user2 = await this.findUser(userid2);
    if (!user2){
      throw new BadRequestException({code: 'invalid id', message: `User with '${userid2}' does not exist`})
    }
    const existeddm = await this.checkIfDmExisted(user1.id, user2.id);

    if (existeddm.length === 0)
    {
      const directmessage = this.Chatrepository.create({
        ownerID: user1.id,
        userID: [user1.id, user2.id],
        name:`${user1.id},${user2.id}`,
        type: ChatTypes.DM,
        status: RoomStatus.PRIVATE
      });
      return await this.Chatrepository.save(directmessage);
    }
    return existeddm[0];
  }

  async RemoveDm(dm: CreateDmDto)
  {
    const user1 = await this.findUser(dm.userID1);
    if (!user1){
      throw new BadRequestException({code: 'invalid id', message: `User with '${dm.userID1}' does not exist`})
    }

    const user2 = await this.findUser(dm.userID2);
    if (!user2){
      throw new BadRequestException({code: 'invalid id', message: `User with '${dm.userID2}' does not exist`})
    }

    const existeddm = await this.checkIfDmExisted(user1.id, user2.id);
    if (existeddm.length)
    {
      await this.Chatrepository
      .createQueryBuilder()
      .delete()
      .from(Chat)
      .where('type=:type', { type: ChatTypes.DM })
      .andWhere('name=:name or name=:name2', {
        name: `${user1.id},${user2.id}`,
        name2: `${user2.id},${user1.id}`,
      })
      .execute()
    }
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
      name: room.name,
      type: ChatTypes.CHATROOM,
      status: room.status,
      password: this.checkPassword(room.password, room.status)
    });

    await this.Chatrepository.save(newRoom);

    return newRoom;
  }

/** invite user to join private chat room 
 * The room owner must send an invitation to join the room only to his friends
*/
async InviteUser(owner: number, SetRolestoMembersDto: SetRolestoMembersDto)
{
  const user = await this.findUser(SetRolestoMembersDto.userID);

  if (!user){
    throw new BadRequestException({code: 'invalid id', message: `User with '${SetRolestoMembersDto.userID}' does not exist`})
  }

  const checkowner = await this.findUser(owner);

  if (!checkowner){
    throw new BadRequestException({code: 'invalid id', message: `User with '${owner}' does not exist`})
  }

    const check = await this.checkRoomOwner(SetRolestoMembersDto.RoomID, owner);

    if (checkowner.FriendsID.includes(user.id))
    {
      if (!check.InvitedUserID.includes(user.id) && !check.userID.includes(user.id) && check.status === RoomStatus.PRIVATE)
      {
        check.InvitedUserID.push(user.id);
        await this.Chatrepository.save(check);
      }
      else
        throw new ForbiddenException({code: 'Forbidden', message: `Failed to invite this user to this chat room!!!`})
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
  
   /** **To do** Get users with stat[owner or admin or simple user or banned or muted], avatar, username, id */
  /** {id: 6432, username: sara, avatar: rtet, stat: owner} */

  private new_obj(id: number, username: string, avatar: string, stat: string)
  {
    const p = {
      id: id,
      username: username,
      avatar: avatar,
      stat: stat
    };
    return p;
  }

  async userStat(roomName: string, userId: number)
  {
    const user_data = [];
    // check if the room already exist
    const name = await this.findRoom(roomName);

    if (!name){
      throw new BadRequestException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})
    }
	if (!name.userID.includes(userId)) {
		throw new ForbiddenException();
	}
      
      const profils = await this.Userrepository
      .createQueryBuilder("db_user")
      .select(['db_user.id','db_user.username', 'db_user.avatar'])
      .where("db_user.id IN (:...users)", { users: name.userID })
      .getRawMany();

      profils.forEach((element) => {
        if (element.db_user_id === name.ownerID)
        {
          user_data.push(this.new_obj(element.db_user_id, element.db_user_username, element.db_user_avatar, "owner")); 
        }
        else if (name.AdminsID.includes(element.db_user_id))
        {
          user_data.push(this.new_obj(element.db_user_id, element.db_user_username, element.db_user_avatar, "admin"));
        }      
        else if (name.MutedAndBannedID.find(elm => {
          if (elm.userID === element.db_user_id && elm.action === Action.BAN)
          {
            user_data.push(Object.assign(this.new_obj(element.db_user_id, element.db_user_username, element.db_user_avatar, "banned"),
            { releasetime: elm.current_time + elm.duration * 1000 }));
            return true;
          }
          return false;
        }))
        {}
        else if (name.MutedAndBannedID.find(elm => {
          if (elm.userID === element.db_user_id && elm.action === Action.MUTE)
          {
            user_data.push(Object.assign(this.new_obj(element.db_user_id, element.db_user_username, element.db_user_avatar, "muted"),
            { releasetime: elm.current_time + elm.duration * 1000 }));
            return true;
          }
          return false;
        }))
        {}
        else
        {
          user_data.push(this.new_obj(element.db_user_id, element.db_user_username, element.db_user_avatar, "user"));
        }
      });
      return (user_data);
  }

  /** Change visibility */

  //     The channel owner can set a password required to access the channel, change
  //     it, and also remove it.

  async ChangeVisibility(password: string, status: string, ownerID: number, name: string)
  {
    await this.Chatrepository
    .createQueryBuilder()
    .update(Chat)
    .set({password: password, status: status})
    .where("ownerID = :ownerID", {ownerID})
    .andWhere("name = :name", {name})
    .execute()
  }

  async SetPasswordToRoom(RoomDto: RoomWoUserDto, owner: number)
  {
    await this.Chatrepository.findOneOrFail({
      where: {
          name: RoomDto.name,
          ownerID: owner,
      },
      }).catch(() => {
        throw new UnauthorizedException({code: 'Unauthorized', message: `can not set password to '${RoomDto.name}' chat room!!`})
      });

      const hash = await bcrypt.hash(RoomDto.password, parseInt(process.env.SALT));

      await this.ChangeVisibility(hash, RoomStatus.PROTECTED, owner, RoomDto.name);
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

      await this.ChangeVisibility(null, RoomStatus.PUBLIC, owner, RoomName);
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
    .where("(db_chat.status != :status AND NOT (:id = ANY (db_chat.userID)) ) OR (:id = ANY (db_chat.InvitedUserID)) ",
      { id, status: RoomStatus.PRIVATE })
    .andWhere("db_chat.type = :type", { type: ChatTypes.CHATROOM})
    .groupBy("db_chat.id")
    .addGroupBy("db_user.id")
    .addGroupBy("db_chat.name")
    .getRawMany()
    return allrooms; 
  }

  async Room(id: number)
  {
    const room = await this.Chatrepository
    .createQueryBuilder("db_chat")
    .select(['*'])
    .where("id=:id", { id })
    .getRawOne()
	let hacks = {...room, password: ""}
    return hacks;
  }

  async AllUserRoom(userId: number)
  {
    const room = await this.Chatrepository
    .createQueryBuilder()
    .where(":id = ANY (Chat.userID)", { id: userId })
    .getMany()
    return room; 
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
    .select(['db_chat.name', 'db_chat.id', 'db_chat.status', 'db_chat.type'])
    .addSelect("array_length (db_chat.userID, 1)", "number of users")
    .leftJoin(User, 'db_user', 'db_user.id = db_chat.ownerID')
    .addSelect('db_user.username', 'ownerName')
    .where("(:id = ANY (db_chat.userID))", { id })
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

    const check = await  this.checkRoomOwner(SetRolestoMembersDto.RoomID, owner);

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
	    // console.log({SetRolestoMembersDto, isOwner, isUserRoom})
      if (isOwner)
      {
        if (isOwner.AdminsID.length)
        {
          isOwner.userID = isOwner.userID.filter(item => item !==  isOwner.ownerID);

          var randomadmin = this.random_item(isOwner.AdminsID);
        
          isOwner.AdminsID = isOwner.AdminsID.filter(item => item !== randomadmin);

        //   console.log("random admin ", randomadmin);

          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({ownerID: randomadmin, userID: isOwner.userID, AdminsID: isOwner.AdminsID})
          .where("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()


        //   console.log("Leave the channel and give ownership to a random admin ", isOwner);

        }
        else if (!(isOwner.userID.length === 1))
        {
          isOwner.userID = isOwner.userID.filter(item => item !== isOwner.ownerID);

          var randomuser = this.random_item(isOwner.userID);

          await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({ownerID: randomuser, userID: isOwner.userID})
          .andWhere("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()

        //   console.log("Leave the channel and give ownership to a random user ");
        }
        else if (isOwner.userID.length === 1)
        {
          await this.Chatrepository
          .createQueryBuilder()
          .delete()
          .from(Chat)
          .andWhere("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()
         
          //delete messages from ChatLogs
          await this.ChatLogsrepository
          .createQueryBuilder()
          .delete()
          .from(ChatLogs)
          .where("roomName = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()

        //   console.log("the Room is deleted ");
       
        }
      }
      else if (isUserRoom)
      {
        if (isUserRoom.userID.includes(SetRolestoMembersDto.userID))
        {
          if (isUserRoom.AdminsID.includes(SetRolestoMembersDto.userID))
          {
            isUserRoom.AdminsID = isUserRoom.AdminsID.filter(item => item !== SetRolestoMembersDto.userID);
            // console.log("Simple Admin Leaving this room");
          }
          isUserRoom.userID = isUserRoom.userID.filter(item => item !== SetRolestoMembersDto.userID);
       
          const ret_query = await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({userID: isUserRoom.userID, AdminsID: isUserRoom.AdminsID})
          .where("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()

        //   console.log("Simple user Leaving this room", isUserRoom);
        }
        else
          throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveUserRoom}`})
      }
      else
        throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {LeaveOwnerRoom}`})
    }

    /** Kick user */

    async KickUser(administrator: number, SetRolestoMembersDto: SetRolestoMembersDto)
    {
      const user = await this.findUser(SetRolestoMembersDto.userID);

      if (!user){
        throw new BadRequestException({code: 'invalid id', message: `User with '${SetRolestoMembersDto.userID}' does not exist`})
      }

      const check = await this.Chatrepository.findOne({
        where: {
            name: SetRolestoMembersDto.RoomID,
            ownerID: administrator,
          },
        });

      const checkadmin = await this.Chatrepository.findOne({
        where: {
            name: SetRolestoMembersDto.RoomID
          },
        });

        if (check && check.userID.includes(user.id) && check.ownerID !== user.id)
        {
          if (check.AdminsID.includes(user.id))
          {
            check.AdminsID = check.AdminsID.filter(item => item !== user.id);
            // console.log("Admin kicked from this room");
          }
          check.userID = check.userID.filter(item => item !== user.id);

          await this.Chatrepository
          .createQueryBuilder()
          .update(Chat)
          .set({userID: check.userID, AdminsID: check.AdminsID})
          .where("name = :name", {name: SetRolestoMembersDto.RoomID})
          .execute()

        //   console.log("the owner kicked this {user/admin} from this room", check);
        }
        else if (checkadmin && checkadmin.userID.includes(user.id) && checkadmin.ownerID !== user.id)
        {
          if (checkadmin.AdminsID.includes(administrator) && administrator !== user.id)
          {
            console.log("tab userID ",checkadmin.userID);
            checkadmin.userID = checkadmin.userID.filter(item => item !== user.id);

            await this.Chatrepository
            .createQueryBuilder()
            .update(Chat)
            .set({userID: checkadmin.userID})
            .where("name = :name", {name: SetRolestoMembersDto.RoomID})
            .execute()
  
            // console.log("the admin kicked this user from this room", check);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {KickUser}`});
        }
        else
          throw new ForbiddenException({code: 'Forbidden', message: `cannot execute this operation {KickUser}`});

    }

    /** The administrators of a channel can ban or mute users for a limited time */

    async BanOrMuteUser(administrator: number, BanOrMuteMembersDto: BanOrMuteMembersDto)
    {
      const user_data = [];
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
        
        if (check && check.userID.includes(user.id))
        {
          /** 
           * You could use Array.find() method to check if the array includes the object as 
           * "Array.includes checks for '===' in the array" which doesn't work for objects
           */

          if (!check.MutedAndBannedID.find(element => element.userID === user.id))
          {
            check.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, userID: user.id, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
            await this.Chatrepository.save(check);

             user_data.push({RoomID: BanOrMuteMembersDto.RoomID, userID: user.id, releasetime: (Date.now() + BanOrMuteMembersDto.duration * 1000), action: BanOrMuteMembersDto.action});
             return (user_data);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `this user is already muted/banned for a specific time!!`})
            // console.log("owner", administrator);
        }
        else if (checkadmin && checkadmin.userID.includes(user.id) && checkadmin.ownerID !== user.id)
        {
          if (checkadmin.AdminsID.includes(administrator))
          {
            if (!checkadmin.MutedAndBannedID.find(element => element.userID === user.id))
            {
              checkadmin.MutedAndBannedID.push({action: BanOrMuteMembersDto.action, userID: user.id, current_time: Date.now(), duration: BanOrMuteMembersDto.duration});
              await this.Chatrepository.save(checkadmin);
               user_data.push({RoomID: BanOrMuteMembersDto.RoomID, userID: user.id, releasetime: (Date.now() + BanOrMuteMembersDto.duration * 1000), action: BanOrMuteMembersDto.action});
              return (user_data);
            }
            else
              throw new ForbiddenException({code: 'Forbidden', message: `this user is already muted/banned for a specific time!!`})
        
            // console.log("administrator", administrator);
          }
          else
            throw new ForbiddenException({code: 'Forbidden', message: `you can't mute/ban this user in this chat room!!`})
        }
        else
          throw new ForbiddenException({code: 'Forbidden', message: `Failed to mute/ban this user in this chat room!!`})
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
      const allchats = await this.Chatrepository
        .createQueryBuilder("db_chat")
        .select(['db_chat.MutedAndBannedID', 'db_chat.name'])
        .getMany();
      if (allchats)
      {
        for (let x = 0; x < allchats.length; x++) {
          let mutedAndBannedID = allchats[x].MutedAndBannedID;
          let roomName = allchats[x].name;
          if (mutedAndBannedID)
          {
            for (let i = 0; i < mutedAndBannedID.length; i++) {
              if ((mutedAndBannedID[i].current_time + mutedAndBannedID[i].duration * 1000) <= Date.now()) {
                mutedAndBannedID = mutedAndBannedID.filter(item => item.userID !== mutedAndBannedID[i].userID);
    
                // console.log("filter user, from mutedID array ", mutedAndBannedID);
    
                await this.Chatrepository
                  .createQueryBuilder()
                  .update(Chat)
                  .set({ MutedAndBannedID: mutedAndBannedID })
                  .where("name = :name", { name: roomName})
                  .execute()
              }
            }
          }
        }
      }
    }

  /*-------------------------------------------------------------------------- */
  

}
