import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { Player } from 'src/players/player.entity';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getAccessToken(code: string): Promise<string>;
    getUserData(code: string): Promise<CreatePlayerDto>;
    sendJWTtoken(player: Player): Promise<void>;
    loginWithCredentials(player: Player): Promise<{
        access_token: string;
    }>;
}
