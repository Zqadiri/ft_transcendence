import { AuthService } from './auth.service';
import { Response } from "express";
import { PlayersService } from 'src/users/users.service';
export declare class AuthController {
    private authService;
    private readonly playerService;
    constructor(authService: AuthService, playerService: PlayersService);
    access_token(query: {
        code: string;
    }, response: Response): Promise<Response<any, Record<string, any>>>;
}
