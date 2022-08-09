import { UsersService } from 'src/users/users.service';
import { FriendsService } from './friends.service';
export declare class FriendsController {
    private readonly usersService;
    private readonly FriendService;
    constructor(usersService: UsersService, FriendService: FriendsService);
    getUserFriends(id: number): Promise<import("./entities/friend.entity").Friend[]>;
    getAllFriend(): Promise<import("./entities/friend.entity").Friend[]>;
}
