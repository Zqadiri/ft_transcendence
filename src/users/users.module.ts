import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FriendsService } from 'src/friends/friends.service';
import { relationRepository } from 'src/friends/relation.repository';
import { Friend } from 'src/friends/friend.intity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      relationRepository,
      UserRepository,
      User
    ]),
  ],
  controllers: [UsersController],
  providers: [FriendsService, UsersService]
})
export class UsersModule {}
