import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from 'src/users/dto/create-player.dto';
import { User } from 'src/users/user.entity';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getAccessToken(code: string): Promise<string>;
    getUserData(code: string): Promise<CreatePlayerDto>;
    sendJWTtoken(player: User): Promise<void>;
    loginWithCredentials(player: User): Promise<{
        access_token: string;
    }>;
}
