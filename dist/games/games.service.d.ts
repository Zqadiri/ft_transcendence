import { CreateGameDto } from './dto/game.dto';
import { Game } from './entities/game.entity';
import { GameRepository } from './game.repository';
export declare class GamesService {
    private readonly GameRepo;
    constructor(GameRepo: GameRepository);
    createGame(createGameDto: CreateGameDto): Promise<Game>;
    updateOneScore(gameID: number, score: number, playerNum: boolean): Promise<import("typeorm").UpdateResult>;
    remove(gameID: number): Promise<Game>;
    findGameByid(id: number): Promise<Game>;
    findGameByUser(userID: number): Promise<Game[]>;
}
