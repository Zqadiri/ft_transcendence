import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLogsDto } from './dto/chat-logs.dto';
import { ChatLogs } from './entities/chat-log.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatsService } from 'src/chats/chats.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatLogsService {

  @InjectRepository(ChatLogs)
  private readonly ChatLogsrepository: Repository<ChatLogs>;

  @InjectRepository(User)
  private readonly repo: Repository<User>;

  constructor(private readonly chatsService: ChatsService){}

  /** simple real time chat functions */

  async savechat(chatlogsdto: ChatLogsDto) : Promise<ChatLogs>
  {
    // This action adds a new chat

    const msg = this.ChatLogsrepository.create({
        userID: chatlogsdto.userID,
        roomName: chatlogsdto.roomName,
        message: chatlogsdto.message,
    });

    return await this.ChatLogsrepository.save(msg);
  }

  async DisplayRoomMessages(roomName: string)
  {
    const room = this.chatsService.findRoom(roomName);
    if (!room)
      throw new WsException({code: 'invalid chat room name', message: `Room with '${roomName}' does not exist`})

    const roommessages = await this.ChatLogsrepository
      .createQueryBuilder()
      .select("ChatLogs.userID", "userID")
      .addSelect("ChatLogs.roomName", "roomName")
      .addSelect("ChatLogs.message", "message")
      .leftJoin(User, 'db_user', 'db_user.id = ChatLogs.userID')
      .addSelect('db_user.avatar', 'avatar')
      .addSelect('db_user.username', 'username')
      .orderBy({'ChatLogs.createdAt': 'ASC'})
      .where ("ChatLogs.roomName = :roomName", {roomName: roomName})
      .getRawMany()
  
   
    return roommessages;
  }

  async GetMessage(messageID: number)
  {
    const message = await this.ChatLogsrepository
    .createQueryBuilder()
    .select("ChatLogs.userID", "userID")
    .addSelect("ChatLogs.roomName", "roomName")
    .addSelect("ChatLogs.message", "message")
    .leftJoin(User, 'db_user', 'db_user.id = ChatLogs.userID')
    .addSelect('db_user.avatar', 'avatar')
    .addSelect('db_user.username', 'username')
    .where ("ChatLogs.id = :id", {id: messageID})
    .getRawOne()

    return message;
  }

  async findUser(userID: string)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const id = await this.repo.findOneBy({ username: userID });
    if (!id)
      throw new WsException({code: 'invalid username', message: `User with '${userID}' does not exist`})
    return id;
  }

  async findUserUsingID(userID: number)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    const id = await this.repo.findOneBy({ id: userID });
    if (!id)
      throw new WsException({code: 'invalid id', message: `User with '${userID}' does not exist`})
    return id;
  }

  async FindAvatar(userID: string)
  {
    const user = await this.findUser(userID);
   
    const av = await this.repo
    .createQueryBuilder('db_user')
    .select('db_user.avatar', 'avatar')
    .where ("db_user.username = :userID", {userID: user.username})
    .getRawOne()
    return av;
  }

}
