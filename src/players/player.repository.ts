import { Player } from "./player.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

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