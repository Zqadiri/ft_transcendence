import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
import { ChatsService } from 'src/chats/chats.service';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      User,
      Chat,
      ChatLogs
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ChatsService, ChatLogsService, JwtService]
})
export class UsersModule {}
