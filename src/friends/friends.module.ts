import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Friend } from './entities/friend.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { relationRepository } from './relation.repository';
import { UserRepository } from 'src/users/user.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Friend, relationRepository, UserRepository])
  ],
  controllers: [FriendsController],
  providers: [UsersService, FriendsService]
})
export class FriendsModule {}
