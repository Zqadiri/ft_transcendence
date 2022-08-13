import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateAfterGameDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AvatarDto } from './dto/upload.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
    update(userID: number, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updateAfterGame(userID: number, updateAfterGame: UpdateAfterGameDto): Promise<import("typeorm").UpdateResult>;
    isMatched(userID: number): Promise<import("typeorm").UpdateResult>;
    removeUser(userID: number): Promise<User>;
    calculateRank(userID: number): Promise<User>;
    getUserById(id: number): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<import("typeorm").UpdateResult>;
    uploadAvatar(id: number, avatarDto: AvatarDto): Promise<User>;
    updateUsername(id: number, newUsername: string): Promise<void>;
}
