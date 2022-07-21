import { Player } from "./player.entity";
import { Repository } from "typeorm";
import { EntityRepository } from "typeorm";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
	
	async findUserIfExist(id: number) : Promise<Player>{
		const player = await this.findOne({
			where:{
				id: id,
			}
		})
		return player;
	}

	
}