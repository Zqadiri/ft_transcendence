
import { Player } from "./player.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {

	// async UserExisted(): Promise<Player[]> {
	// 	return null;
	// }
}