import { Game } from "./entities/game.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Game)
class GameRepository extends Repository<Game> {

}

export { GameRepository };