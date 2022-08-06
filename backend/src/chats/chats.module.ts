import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from './chats.controller';
import { Dm } from './entities/dm.entitiy';
import { Message } from './entities/message.entity';


@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Dm, Chat, Message])],
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatController]
})
export class ChatsModule {}
