import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLogsService } from './chat-logs.service';
import { ChatLogs } from './entities/chat-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLogs])],
  controllers: [ChatLogsController],
  providers: [ChatLogsService]
})
export class ChatLogsModule {}
