import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLogsService } from './chat-logs.service';
import { ChatLogs } from './entities/chat-log.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ChatLogs, Chat, User])],
  controllers: [ChatLogsController],
  providers: [ChatLogsService, ChatsService ,UsersService, JwtService]
})
export class ChatLogsModule {}
