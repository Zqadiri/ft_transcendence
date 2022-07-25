import { User } from './user.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerRepository } from './user.repository';
export declare class PlayersService {
    private playerRepository;
    constructor(playerRepository: PlayerRepository);
    getUserById(id: number): Promise<User>;
    create(createPlayerDto: CreatePlayerDto): Promise<User>;
}
