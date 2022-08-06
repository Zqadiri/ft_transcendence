import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatController } from './chats.controller';


@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([Chat])],
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatController]
})
export class ChatsModule {}
