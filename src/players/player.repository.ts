import { Player } from "./player.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {
    // async getUserIfExist(login : string){
    //     await this.playerRepository.findOne({
    //         where:{
    //             username: login,
    //         }
    //     })
    // }
}