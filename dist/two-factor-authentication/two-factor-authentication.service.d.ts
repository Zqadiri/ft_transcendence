import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
export declare class TwoFactorAuthenticationService {
    private readonly userService;
    constructor(userService: UsersService);
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        secret: string;
        urlPath: string;
    }>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<any>;
}
