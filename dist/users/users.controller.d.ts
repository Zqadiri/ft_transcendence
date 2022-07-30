/// <reference types="multer" />
import { UsersService } from './users.service';
import RequestWithUser from 'src/two-factor-authentication/requestWithUser.interface';
import { User } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserData(id: number): Promise<User>;
    uploadFile(request: RequestWithUser, file: Express.Multer.File): Promise<import("typeorm").UpdateResult>;
}
