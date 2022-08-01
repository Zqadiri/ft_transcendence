import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { PlayersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsController } from './chats.controller';
import { Dm } from './entities/dm.entitiy';

@Module({
  imports: [AuthModule, PlayersModule, TypeOrmModule.forFeature([Dm])],
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatsController]
})
export class ChatsModule {}
