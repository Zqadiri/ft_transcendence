import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLogsDto } from './dto/chat-logs.dto';
import { ChatLogs } from './entities/chat-log.entity';

@Injectable()
export class ChatLogsService {

  @InjectRepository(ChatLogs)
  private readonly ChatLogsrepository: Repository<ChatLogs>;

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
    const roommessages = await this.ChatLogsrepository
    .createQueryBuilder()
    .select("ChatLogs.userID", "userID")
    .addSelect("ChatLogs.roomName", "roomName")
    .addSelect("ChatLogs.message", "message")
    .orderBy({'ChatLogs.createdAt': 'DESC'})
    .where ("ChatLogs.roomName = :roomName", {roomName: roomName})
    .getRawMany()


    return roommessages;

  }
}
