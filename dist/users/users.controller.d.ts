/// <reference types="multer" />
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FriendsService } from 'src/friends/friends.service';
export declare class UsersController {
    private readonly usersService;
    private readonly FriendService;
    constructor(usersService: UsersService, FriendService: FriendsService);
    getUserData(id: number): Promise<User>;
    updateUsername(req: any, newUsername: string): Promise<void>;
    uploadFile(req: any, file: Express.Multer.File, res: any): Promise<void>;
    AddFriend(userID: number, req: any, res: any): Promise<void>;
    getAllFriend(): Promise<import("../friends/entities/friend.entity").Friend[]>;
}
