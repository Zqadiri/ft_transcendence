import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PlayerRepository } from './user.repository';
export declare class PlayersService {
    private playerRepository;
    constructor(playerRepository: PlayerRepository);
    getUserById(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
}
