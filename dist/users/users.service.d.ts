import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: UserRepository);
    getUserById(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<import("typeorm").UpdateResult>;
    uploadAvatar(id: number): any;
}
