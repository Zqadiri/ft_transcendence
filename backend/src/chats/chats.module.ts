import { Module } from '@nestjs/common';
import { ChatService } from './chats.service';
import { ChatController } from './chats.controller';

@Module({
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
