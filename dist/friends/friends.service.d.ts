import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './friend.intity';
import { relationRepository } from 'src/friends/relation.repository';
export declare class FriendsService {
    private readonly userService;
    private readonly relationRepo;
    constructor(userService: UsersService, relationRepo: relationRepository);
    createFriendRelation(createRelation: CreateRelation): Promise<Friend>;
}
