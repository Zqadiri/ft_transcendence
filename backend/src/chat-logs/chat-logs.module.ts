import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLogsService } from './chat-logs.service';
import { ChatLogs } from './entities/chat-log.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ChatLogs, User])],
  controllers: [ChatLogsController],
  providers: [ChatLogsService, UsersService]
})
export class ChatLogsModule {}
