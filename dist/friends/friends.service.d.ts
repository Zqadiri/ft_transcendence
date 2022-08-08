import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './entities/friend.entity';
import { relationRepository } from 'src/friends/relation.repository';
import { User } from 'src/users/entities/user.entity';
export declare class FriendsService {
    private readonly userService;
    private readonly relationRepo;
    constructor(userService: UsersService, relationRepo: relationRepository);
    createFriendRelation(createRelation: CreateRelation, user: User): Promise<Friend>;
    getAllFriends(): Promise<Friend[]>;
    findFollowers({ index: index }: {
        index: any;
    }): Promise<Friend[]>;
}
