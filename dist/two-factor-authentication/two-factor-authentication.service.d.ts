import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
export declare class TwoFactorAuthenticationService {
    private userRepository;
    private readonly userService;
    constructor(userRepository: Repository<User>, userService: UsersService);
    generateTwoFacAuthSecret(user: User): Promise<{
        secret: string;
        urlPath: string;
    }>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<any>;
    activateTwoFacAuth(userID: number): Promise<import("typeorm").UpdateResult>;
    isTwoFacAuthCodeValid(twoFacAuthCode: string, user: User): boolean;
}
