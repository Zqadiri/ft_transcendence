import { UsersService } from 'src/users/users.service';
import { CreateRelation, UpdateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './entities/friend.entity';
import { relationRepository } from 'src/friends/relation.repository';
import { User } from 'src/users/entities/user.entity';
export declare class FriendsService {
    private readonly userService;
    private readonly relationRepo;
    constructor(userService: UsersService, relationRepo: relationRepository);
    findOneFriend(id: number): Promise<Friend>;
    isFollowing(createRelation: CreateRelation): Promise<boolean>;
    createFriendRelation(createRelation: CreateRelation, user: User): Promise<Friend>;
    getAllFriends(): Promise<Friend[]>;
    findFollowers(id: number): Promise<Friend[]>;
    findFollowings(id: number): Promise<Friend[]>;
    findAllBlockedUsers(id: number): Promise<Friend[]>;
    update(id: number, updateRela: UpdateRelation): Promise<Friend>;
    remove(id: number): Promise<Friend>;
}
