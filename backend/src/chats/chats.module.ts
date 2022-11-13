import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from './chats.controller';
import { User } from 'src/users/entities/user.entity';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
import { ChatLogsService } from 'src/chat-logs/chat-logs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Chat, User, ChatLogs]), ScheduleModule.forRoot()],
  providers: [ChatsGateway, ChatsService, ChatLogsService, UsersService, JwtService],
  controllers: [ChatController],
  exports: [ChatsService]
})
export class ChatsModule {}
