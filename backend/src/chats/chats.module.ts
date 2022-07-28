import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { PlayersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, PlayersModule, TypeOrmModule.forFeature([Chat])],
  providers: [ChatsGateway, ChatsService]
})
export class ChatsModule {}
