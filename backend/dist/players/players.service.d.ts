import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerRepository } from './player.repository';
export declare class PlayersService {
    private playerRepository;
    constructor(playerRepository: PlayerRepository);
    getUserById(id: number): Promise<Player>;
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
}
