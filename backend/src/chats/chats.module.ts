import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from './chats.controller';
import { User } from 'src/users/entities/user.entity';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Chat, User, ChatLogs]), ScheduleModule.forRoot()],
  providers: [ChatsGateway, ChatsService, ChatLogsService],
  controllers: [ChatController]
})
export class ChatsModule {}
