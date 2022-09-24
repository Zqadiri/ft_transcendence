import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLogsDto } from './dto/chat-logs.dto';
import { ChatLogs } from './entities/chat-log.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatsService } from 'src/chats/chats.service';

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
        message: chatlogsdto.message
    });

    return await this.ChatLogsrepository.save(msg);
  }

  async DisplayRoomMessages(roomName: string)
  {
    let roommessages;
    const room = this.chatsService.findRoom(roomName);

    if (room)
    {
      roommessages = await this.ChatLogsrepository
      .createQueryBuilder()
      .select("ChatLogs.userID", "userID")
      .addSelect("ChatLogs.roomName", "roomName")
      .addSelect("ChatLogs.message", "message")
      .leftJoin(User, 'db_user', 'db_user.username = ChatLogs.userID')
      .addSelect('db_user.avatar', 'avatar')
      .orderBy({'ChatLogs.createdAt': 'ASC'})
      .where ("ChatLogs.roomName = :roomName", {roomName: roomName})
      .getRawMany()
    }
   
    return roommessages;
  }

  async GetMessage(messageID: number)
  {
    const message = await this.ChatLogsrepository
    .createQueryBuilder()
    .select("ChatLogs.userID", "userID")
    .addSelect("ChatLogs.roomName", "roomName")
    .addSelect("ChatLogs.message", "message")
    .leftJoin(User, 'db_user', 'db_user.username = ChatLogs.userID')
    .addSelect('db_user.avatar', 'avatar')
    .where ("ChatLogs.id = :id", {id: messageID})
    .getRawOne()

    return message;
  }

  async findUser(userID: string)
  {
    // findOneBy - Finds the first entity that matches given FindOptionsWhere.
    return await this.repo.findOneBy({ username: userID });
  }

  async FindAvatar(userID: string)
  {
    const user = await this.findUser(userID);
    if (!user){
      throw new BadRequestException({code: 'invalid username', message: `User with '${userID}' does not exist`})
    }
    
    const av = await this.repo
    .createQueryBuilder('db_user')
    .select('db_user.avatar', 'avatar')
    .where ("db_user.username = :userID", {userID: user.username})
    .getRawOne()
    return av;
  }

}
