import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getAccessToken(code: string): Promise<string>;
    getUserData(code: string): Promise<CreateUserDto>;
    sendJWTtoken(user: User, response: Response): Promise<Response<any, Record<string, any>>>;
    loginWithCredentials(user: User): Promise<string>;
}
