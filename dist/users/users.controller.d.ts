/// <reference types="multer" />
import { UsersService } from './users.service';
import RequestWithUser from 'src/two-factor-authentication/requestWithUser.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    uploadFile(request: RequestWithUser, file: Express.Multer.File): Promise<any>;
}
