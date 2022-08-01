/// <reference types="multer" />
import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserData(id: number): Promise<User>;
    updateUsername(req: any, newUsername: string): Promise<void>;
    uploadFile(req: any, file: Express.Multer.File, res: any): Promise<void>;
    AddFriend(userID: number, req: any, res: any): Promise<void>;
}
