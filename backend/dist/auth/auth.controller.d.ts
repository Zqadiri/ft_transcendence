import { AuthService } from './auth.service';
import { PlayersService } from 'src/players/players.service';
export declare class AuthController {
    private authService;
    private readonly playerService;
    constructor(authService: AuthService, playerService: PlayersService);
    access_token(query: {
        code: string;
    }): Promise<void>;
}
